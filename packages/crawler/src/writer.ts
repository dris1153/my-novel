import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';
import { countWords, slugify, type Database, type NovelStatus } from 'shared';

import { fetchImage } from './fetch.ts';

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Thiếu biến môi trường ${name} — xem .env.example`);
  return v;
}

// service_role: bypass RLS. CHỈ chạy cục bộ, không bao giờ lộ ra client.
// Lazy để `pnpm crawl` (không tham số) in được usage trước khi đòi env.
let _supabase: ReturnType<typeof createClient<Database>> | null = null;
function db() {
  if (!_supabase) {
    _supabase = createClient<Database>(
      required('SUPABASE_URL'),
      required('SUPABASE_SERVICE_ROLE_KEY'),
      { auth: { persistSession: false } }
    );
  }
  return _supabase;
}

export type NovelMeta = {
  title: string;
  author: string;
  status: NovelStatus;
  description: string | null;
  coverUrl: string | null;
  genreSlugs: string[];
};

/** Upsert truyện theo slug (nháp). Trả về id để ghi chương. */
export async function upsertNovel(meta: NovelMeta, coverUrl: string | null): Promise<string> {
  const slug = slugify(meta.title);
  const { data, error } = await db()
    .from('novels')
    .upsert(
      {
        slug,
        title: meta.title,
        author: meta.author,
        status: meta.status,
        description: meta.description,
        cover_url: coverUrl,
        published: false, // nháp — admin duyệt trước khi lên app
      },
      { onConflict: 'slug' }
    )
    .select('id')
    .single();

  if (error) throw new Error(`upsertNovel: ${error.message}`);
  return data.id;
}

/** Khớp genre nguồn với bảng genres seed. Genre không có sẵn → log, bỏ qua. */
export async function mapGenres(novelId: string, sourceSlugs: string[]): Promise<void> {
  if (sourceSlugs.length === 0) return;

  const { data: known } = await db().from('genres').select('id, slug').in('slug', sourceSlugs);
  const bySlug = new Map((known ?? []).map((g) => [g.slug, g.id]));

  const missed = sourceSlugs.filter((s) => !bySlug.has(s));
  if (missed.length) console.warn(`  genre không có trong DB, bỏ qua: ${missed.join(', ')}`);

  const rows = [...bySlug.values()].map((genre_id) => ({ novel_id: novelId, genre_id }));
  if (rows.length) {
    const { error } = await db().from('novel_genres').upsert(rows, { onConflict: 'novel_id,genre_id' });
    if (error) console.warn(`  mapGenres: ${error.message}`);
  }
}

/** Tải cover về, upload R2 nguyên bản. Lỗi → trả null, không chặn job. */
export async function uploadCover(sourceUrl: string | null, slug: string): Promise<string | null> {
  if (!sourceUrl) return null;

  const img = await fetchImage(sourceUrl);
  if (!img) {
    console.warn('  cover tải thất bại, để trống');
    return null;
  }

  const ext = img.contentType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
  const key = `covers/${slug}-${Date.now()}.${ext}`;

  try {
    const s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${required('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: required('R2_ACCESS_KEY_ID'),
        secretAccessKey: required('R2_SECRET_ACCESS_KEY'),
      },
    });
    await s3.send(
      new PutObjectCommand({
        Bucket: required('R2_BUCKET'),
        Key: key,
        Body: img.buffer,
        ContentType: img.contentType,
      })
    );
    return `${required('R2_PUBLIC_URL').replace(/\/$/, '')}/${key}`;
  } catch (e) {
    console.warn(`  cover upload R2 lỗi: ${e instanceof Error ? e.message : e}`);
    return null;
  }
}

/** Số chương đã có trong DB — để skip khi resume. */
export async function existingChapterNumbers(novelId: string): Promise<Set<number>> {
  const { data, error } = await db()
    .from('chapters')
    .select('number')
    .eq('novel_id', novelId);
  if (error) throw new Error(`existingChapterNumbers: ${error.message}`);
  return new Set((data ?? []).map((c) => c.number));
}

export async function upsertChapter(
  novelId: string,
  number: number,
  title: string,
  content: string
): Promise<void> {
  const { error } = await db().from('chapters').upsert(
    {
      novel_id: novelId,
      number,
      title,
      content,
      word_count: countWords(content),
      published: true,
    },
    { onConflict: 'novel_id,number' }
  );
  if (error) throw new Error(`upsertChapter ${number}: ${error.message}`);
}
