// Định dạng repo `novel-data`. Không bao giờ list thư mục (Contents API cắt ở 1000 entry),
// nên mọi đường dẫn đều dựng từ slug + số chương.

export type StoredNovelStatus = 'ongoing' | 'completed' | 'hiatus';

export type NovelMeta = {
  slug: string;
  title: string;
  author: string;
  description: string | null;
  status: StoredNovelStatus;
  genres: string[];
  cover: 'cover.jpg' | null;
  featured: boolean;
  sourceUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ChapterEntry = { n: number; title: string };

export type IndexNovel = Pick<
  NovelMeta,
  'slug' | 'title' | 'author' | 'status' | 'genres' | 'cover' | 'featured' | 'updatedAt'
> & { chapterCount: number };

export type StoreGenre = { slug: string; name: string };

// Derived: sinh lại từ meta.json + chapters.json, không sửa tay.
export type NovelIndex = {
  updatedAt: string | null;
  genres: StoreGenre[];
  novels: IndexNovel[];
};

export type ProgressEntry = { chapter: number; scroll: number; updatedAt: string };

export type UserState = {
  library: { slug: string; addedAt: string }[];
  progress: Record<string, ProgressEntry>;
};

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const USER_ID = /^[0-9a-f]{32}$/;

export const INDEX_PATH = 'index.json';
export const STATE_BRANCH = 'state';

export function isSlug(s: string): boolean {
  return SLUG.test(s);
}

function assertSlug(slug: string): string {
  if (!SLUG.test(slug)) throw new Error(`slug không hợp lệ: ${slug}`);
  return slug;
}

export function metaPath(slug: string): string {
  return `novels/${assertSlug(slug)}/meta.json`;
}

export function coverPath(slug: string): string {
  return `novels/${assertSlug(slug)}/cover.jpg`;
}

export function chaptersIndexPath(slug: string): string {
  return `novels/${assertSlug(slug)}/chapters.json`;
}

export function chapterPath(slug: string, n: number): string {
  if (!Number.isInteger(n) || n < 1) throw new Error(`số chương không hợp lệ: ${n}`);
  return `novels/${assertSlug(slug)}/chapters/${String(n).padStart(5, '0')}.txt`;
}

// Nằm trên branch STATE_BRANCH, không phải main.
export function statePath(userId: string): string {
  if (!USER_ID.test(userId)) throw new Error(`userId không hợp lệ: ${userId}`);
  return `state/${userId}.json`;
}

export const EMPTY_STATE: UserState = { library: [], progress: {} };
