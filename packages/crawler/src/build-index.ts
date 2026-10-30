import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { INDEX_PATH, type ChapterEntry, type NovelIndex, type NovelMeta, type StoreGenre } from 'shared/src/store.ts';

export function makeIndex(
  genres: StoreGenre[],
  items: { meta: NovelMeta; chapterCount: number }[]
): NovelIndex {
  const novels = items
    .map(({ meta: m, chapterCount }) => ({
      slug: m.slug,
      title: m.title,
      author: m.author,
      status: m.status,
      genres: m.genres,
      cover: m.cover,
      featured: m.featured,
      updatedAt: m.updatedAt,
      chapterCount,
    }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.slug.localeCompare(b.slug));

  // updatedAt của index = mốc mới nhất của truyện, nên cùng input luôn ra cùng output
  // (crawl lại không có gì mới thì không sinh commit).
  return { updatedAt: novels[0]?.updatedAt ?? null, genres, novels };
}

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(file, 'utf8')) as T;
}

/** Quét novels/*, sinh lại index.json (giữ nguyên danh sách genres đang có). */
export function buildIndex(dir: string): NovelIndex {
  const indexFile = path.join(dir, INDEX_PATH);
  const genres = existsSync(indexFile) ? readJson<NovelIndex>(indexFile).genres : [];

  const root = path.join(dir, 'novels');
  const slugs = existsSync(root) ? readdirSync(root) : [];
  const items = slugs.flatMap((slug) => {
    const metaFile = path.join(root, slug, 'meta.json');
    if (!existsSync(metaFile)) return [];
    const chaptersFile = path.join(root, slug, 'chapters.json');
    const chapters = existsSync(chaptersFile) ? readJson<ChapterEntry[]>(chaptersFile) : [];
    return [{ meta: readJson<NovelMeta>(metaFile), chapterCount: chapters.length }];
  });

  const index = makeIndex(genres, items);
  writeFileSync(indexFile, JSON.stringify(index, null, 2) + '\n');
  return index;
}
