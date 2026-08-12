import type { Chapter, Novel } from 'shared';

import { supabase } from './supabase';

/** Cột dùng cho thẻ/lưới truyện — cố tình không lấy `description` cho nhẹ. */
const CARD = 'id, slug, title, author, cover_url, status, view_count, updated_at';

function unwrap<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  if (data === null) throw new Error('Không tìm thấy dữ liệu');
  return data;
}

export type NovelCard = Pick<
  Novel,
  'id' | 'slug' | 'title' | 'author' | 'cover_url' | 'status' | 'view_count' | 'updated_at'
> & { chapters: [{ count: number }] };

export async function fetchRecent(limit = 24, offset = 0) {
  return unwrap(
    await supabase
      .from('novels')
      .select(`${CARD}, chapters(count)`)
      .eq('published', true)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)
      .returns<NovelCard[]>()
  );
}

export async function fetchPopular(limit = 12) {
  return unwrap(
    await supabase
      .from('novels')
      .select(`${CARD}, chapters(count)`)
      .eq('published', true)
      .order('view_count', { ascending: false })
      .limit(limit)
      .returns<NovelCard[]>()
  );
}

export async function fetchByGenre(genreSlug: string, limit = 24, offset = 0) {
  return unwrap(
    await supabase
      .from('novels')
      .select(`${CARD}, chapters(count), novel_genres!inner(genres!inner(slug))`)
      .eq('published', true)
      .eq('novel_genres.genres.slug', genreSlug)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)
      .returns<NovelCard[]>()
  );
}

export async function searchNovels(term: string, limit = 30) {
  const q = term.trim();
  if (!q) return [];
  return unwrap(
    await supabase
      .from('novels')
      .select(`${CARD}, chapters(count)`)
      .eq('published', true)
      .or(`title.ilike.%${q}%,author.ilike.%${q}%`)
      .limit(limit)
      .returns<NovelCard[]>()
  );
}

export async function fetchGenres() {
  return unwrap(await supabase.from('genres').select('id, slug, name').order('name'));
}

export type NovelDetail = Novel & { novel_genres: { genres: { slug: string; name: string } }[] };

export async function fetchNovel(slug: string) {
  return unwrap(
    await supabase
      .from('novels')
      .select('*, novel_genres(genres(slug, name))')
      .eq('slug', slug)
      .single()
      .returns<NovelDetail>()
  );
}

export type ChapterListItem = Pick<Chapter, 'id' | 'number' | 'title' | 'created_at'>;

export async function fetchChapterList(novelId: string) {
  return unwrap(
    await supabase
      .from('chapters')
      .select('id, number, title, created_at')
      .eq('novel_id', novelId)
      .eq('published', true)
      .order('number', { ascending: false })
      .returns<ChapterListItem[]>()
  );
}

export async function fetchChapter(novelSlug: string, number: number) {
  const novel = unwrap(
    await supabase
      .from('novels')
      .select('id, slug, title')
      .eq('slug', novelSlug)
      .single()
      .returns<Pick<Novel, 'id' | 'slug' | 'title'>>()
  );

  const chapter = unwrap(
    await supabase
      .from('chapters')
      .select('*')
      .eq('novel_id', novel.id)
      .eq('number', number)
      .single()
      .returns<Chapter>()
  );

  // Có chương trước/sau hay không — quyết định việc bật/tắt nút điều hướng.
  const { data: neighbours } = await supabase
    .from('chapters')
    .select('number')
    .eq('novel_id', novel.id)
    .eq('published', true)
    .in('number', [number - 1, number + 1]);

  const nums = new Set((neighbours ?? []).map((n) => n.number));
  return {
    novel,
    chapter,
    hasPrev: nums.has(number - 1),
    hasNext: nums.has(number + 1),
  };
}

export async function incrementView(novelId: string) {
  // Đếm lượt đọc không được phép làm hỏng việc đọc -> lỗi thì bỏ qua.
  const { error } = await supabase.rpc('increment_view', { p_novel_id: novelId });
  if (error) console.warn('increment_view:', error.message);
}

export async function saveProgress(novelId: string, chapterId: string, percent: number) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return;
  await supabase
    .from('reading_progress')
    .upsert({ user_id: auth.user.id, novel_id: novelId, chapter_id: chapterId, percent });
}

export async function fetchLibrary(): Promise<NovelCard[]> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];
  const rows = unwrap(
    await supabase
      .from('library')
      .select(`novels(${CARD}, chapters(count))`)
      .eq('user_id', auth.user.id)
      .order('created_at', { ascending: false })
      .returns<{ novels: NovelCard }[]>()
  );
  return rows.map((r) => r.novels);
}

export async function isInLibrary(novelId: string) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return false;
  const { count } = await supabase
    .from('library')
    .select('novel_id', { count: 'exact', head: true })
    .eq('user_id', auth.user.id)
    .eq('novel_id', novelId);
  return (count ?? 0) > 0;
}

/** Trả về trạng thái sau khi đổi. Ném lỗi nếu chưa đăng nhập. */
export async function toggleLibrary(novelId: string, saved: boolean) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('Cần đăng nhập để lưu truyện');

  if (saved) {
    const { error } = await supabase
      .from('library')
      .delete()
      .eq('user_id', auth.user.id)
      .eq('novel_id', novelId);
    if (error) throw new Error(error.message);
    return false;
  }

  const { error } = await supabase
    .from('library')
    .insert({ user_id: auth.user.id, novel_id: novelId });
  if (error) throw new Error(error.message);
  return true;
}

export async function fetchContinueReading() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return [];
  return unwrap(
    await supabase
      .from('reading_progress')
      .select('percent, updated_at, novels(slug, title, cover_url), chapters(number, title)')
      .eq('user_id', auth.user.id)
      .order('updated_at', { ascending: false })
      .limit(5)
      .returns<
        {
          percent: number;
          updated_at: string;
          novels: { slug: string; title: string; cover_url: string | null };
          chapters: { number: number; title: string };
        }[]
      >()
  );
}
