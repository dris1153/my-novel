import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import sharp from 'sharp';
// Subpath thay vì 'shared': index.ts re-export không đuôi .ts, `node --test` không resolve được.
import {
  INDEX_PATH,
  chapterPath,
  chaptersIndexPath,
  coverPath,
  metaPath,
  type ChapterEntry,
  type NovelIndex,
  type NovelMeta,
} from 'shared/src/store.ts';

import { fetchImage } from './fetch.ts';

const COVER_MAX_SIDE = 600;
const COVER_MAX_BYTES = 100 * 1024;

export function dataDir(): string {
  const v = process.env.DATA_REPO_DIR;
  if (!v) throw new Error('Thiếu biến môi trường DATA_REPO_DIR — xem .env.example');
  return v;
}

function abs(dir: string, rel: string): string {
  return path.join(dir, rel);
}

function writeFile(dir: string, rel: string, data: string | Buffer): void {
  const file = abs(dir, rel);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, data);
}

function readJsonIfExists<T>(dir: string, rel: string): T | null {
  const file = abs(dir, rel);
  return existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as T) : null;
}

export function writeJson(dir: string, rel: string, value: unknown): void {
  writeFile(dir, rel, JSON.stringify(value, null, 2) + '\n');
}

/** Slug genre đã có trong index.json — genre nguồn ngoài danh sách này bị bỏ qua. */
export function knownGenreSlugs(dir: string): Set<string> {
  const index = readJsonIfExists<NovelIndex>(dir, INDEX_PATH);
  return new Set((index?.genres ?? []).map((g) => g.slug));
}

export type MetaInput = Pick<NovelMeta, 'slug' | 'title' | 'author' | 'description' | 'status' | 'genres'> & {
  sourceUrl: string;
  hasNewCover: boolean;
};

/**
 * Crawl lại không được mất `featured`, `createdAt`, bìa cũ: chỉ ghi đè metadata nguồn.
 */
export function upsertNovelMeta(dir: string, input: MetaInput, now = new Date().toISOString()): NovelMeta {
  const old = readJsonIfExists<NovelMeta>(dir, metaPath(input.slug));
  // Hai truyện trùng tên cho cùng slug sẽ trộn chương vào nhau — dừng thay vì ghi đè.
  if (old?.sourceUrl && new URL(old.sourceUrl).pathname !== new URL(input.sourceUrl).pathname) {
    throw new Error(`slug "${input.slug}" đã thuộc về truyện khác (${old.sourceUrl})`);
  }
  const meta: NovelMeta = {
    slug: input.slug,
    title: input.title,
    author: input.author,
    description: input.description,
    status: input.status,
    genres: input.genres,
    cover: input.hasNewCover ? 'cover.jpg' : (old?.cover ?? null),
    featured: old?.featured ?? false,
    sourceUrl: input.sourceUrl,
    createdAt: old?.createdAt ?? now,
    updatedAt: old?.updatedAt ?? now,
  };
  writeJson(dir, metaPath(input.slug), meta);
  return meta;
}

/** Bump `updatedAt` (khoá sort "Mới cập nhật") khi có chương mới. */
export function touchNovel(dir: string, slug: string, now = new Date().toISOString()): void {
  const meta = readJsonIfExists<NovelMeta>(dir, metaPath(slug));
  if (meta) writeJson(dir, metaPath(slug), { ...meta, updatedAt: now });
}

/** Tải bìa, nén về jpeg ≤100KB. Lỗi → false, không chặn job. */
export async function writeCover(dir: string, slug: string, sourceUrl: string | null): Promise<boolean> {
  if (!sourceUrl) return false;
  const img = await fetchImage(sourceUrl);
  if (!img) {
    console.warn('  cover tải thất bại, để trống');
    return false;
  }
  try {
    const resized = sharp(img.buffer).resize(COVER_MAX_SIDE, COVER_MAX_SIDE, { fit: 'inside', withoutEnlargement: true });
    let buf = await resized.clone().jpeg({ quality: 80, mozjpeg: true }).toBuffer();
    for (let q = 70; buf.length > COVER_MAX_BYTES && q >= 40; q -= 10) {
      buf = await resized.clone().jpeg({ quality: q, mozjpeg: true }).toBuffer();
    }
    writeFile(dir, coverPath(slug), buf);
    return true;
  } catch (e) {
    console.warn(`  cover xử lý lỗi: ${e instanceof Error ? e.message : e}`);
    return false;
  }
}

/** Mục lục chương theo `n`; ghi ra đĩa bằng flush() để mỗi commit khớp với file chương. */
export class ChapterStore {
  private dir: string;
  private slug: string;
  private entries: Map<number, ChapterEntry>;

  constructor(dir: string, slug: string) {
    this.dir = dir;
    this.slug = slug;
    const list = readJsonIfExists<ChapterEntry[]>(dir, chaptersIndexPath(slug)) ?? [];
    this.entries = new Map(list.map((e) => [e.n, e]));
  }

  has(n: number): boolean {
    return this.entries.has(n);
  }

  get size(): number {
    return this.entries.size;
  }

  write(n: number, title: string, content: string): void {
    writeFile(this.dir, chapterPath(this.slug, n), content.trim() + '\n');
    this.entries.set(n, { n, title });
  }

  flush(): void {
    const list = [...this.entries.values()].sort((a, b) => a.n - b.n);
    writeJson(this.dir, chaptersIndexPath(this.slug), list);
  }
}
