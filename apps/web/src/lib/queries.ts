import {
  INDEX_PATH,
  chapterPath,
  chaptersIndexPath,
  isSlug,
  metaPath,
  type ChapterEntry,
  type IndexNovel,
  type NovelIndex,
  type NovelMeta,
  type StoreGenre,
} from "shared";

import { cleanChapterTitle } from "./chapter-title";
import { readJson, readText } from "./github-store";

export type Genre = StoreGenre;

export type NovelCard = IndexNovel & { coverUrl: string | null };

export type NovelDetail = NovelMeta & {
  coverUrl: string | null;
  chapterCount: number;
  genreList: Genre[];
};

export type ChapterListItem = { number: number; title: string };

export type ChapterView = {
  novel: { slug: string; title: string };
  chapter: { number: number; title: string; content: string };
  /** Chương liền trước/sau trong mục lục; `chapters.json` có thể có lỗ hổng nên không dùng ±1. */
  prevNumber: number | null;
  nextNumber: number | null;
  nextTitle: string | null;
  total: number;
};

// 404 ở đây là sai repo/token (GitHub trả 404 thay vì 401 cho repo private) — phải ném,
// nếu không trang "thư viện trống" sẽ bị cache như thể hợp lệ.
async function getIndex(): Promise<NovelIndex> {
  const index = await readJson<NovelIndex>(INDEX_PATH);
  if (!index) throw new Error(`Không đọc được ${INDEX_PATH} — kiểm tra GITHUB_DATA_REPO/GITHUB_DATA_TOKEN`);
  return index;
}

async function getChapters(slug: string): Promise<ChapterEntry[]> {
  const entries = (await readJson<ChapterEntry[]>(chaptersIndexPath(slug))) ?? [];
  return entries.map((e) => ({ n: e.n, title: cleanChapterTitle(e.title, e.n) }));
}

/** Bìa nằm trong repo private nên đi qua route proxy `/api/cover/[slug]`. */
function coverUrlFor(slug: string, cover: string | null): string | null {
  return cover ? `/api/cover/${slug}` : null;
}

function toCard(novel: IndexNovel): NovelCard {
  return { ...novel, coverUrl: coverUrlFor(novel.slug, novel.cover) };
}

/** Bỏ dấu + hạ chữ thường để "dai phung" khớp "Đại Phụng". */
function fold(text: string): string {
  return text
    .replace(/[đĐ]/g, "d")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** `index.json` đã sắp theo cập nhật mới nhất. */
export async function fetchRecent(limit = 24, offset = 0): Promise<NovelCard[]> {
  const { novels } = await getIndex();
  return novels.slice(offset, offset + limit).map(toCard);
}

export async function fetchGenre(slug: string): Promise<Genre | null> {
  const { genres } = await getIndex();
  return genres.find((g) => g.slug === slug) ?? null;
}

export async function fetchByGenre(slug: string, limit = 24, offset = 0): Promise<NovelCard[]> {
  const { novels } = await getIndex();
  return novels
    .filter((n) => n.genres.includes(slug))
    .slice(offset, offset + limit)
    .map(toCard);
}

export async function fetchCompleted(limit = 24, offset = 0): Promise<NovelCard[]> {
  const { novels } = await getIndex();
  return novels
    .filter((n) => n.status === "completed")
    .slice(offset, offset + limit)
    .map(toCard);
}

export async function searchNovels(term: string, limit = 24, offset = 0): Promise<NovelCard[]> {
  const q = fold(term);
  if (!q) return [];
  const { novels } = await getIndex();
  return novels
    .filter((n) => fold(n.title).includes(q) || fold(n.author).includes(q))
    .slice(offset, offset + limit)
    .map(toCard);
}

export async function fetchNovel(slug: string): Promise<NovelDetail | null> {
  if (!isSlug(slug)) return null;
  const [meta, index] = await Promise.all([readJson<NovelMeta>(metaPath(slug)), getIndex()]);
  if (!meta) return null;

  return {
    ...meta,
    coverUrl: coverUrlFor(meta.slug, meta.cover),
    chapterCount: index.novels.find((n) => n.slug === slug)?.chapterCount ?? 0,
    genreList: index.genres.filter((g) => meta.genres.includes(g.slug)),
  };
}

/** Mới nhất trước (mặc định) hoặc thứ tự đọc. */
export async function fetchChapterList(
  slug: string,
  { limit = 50, offset = 0, newestFirst = true }: { limit?: number; offset?: number; newestFirst?: boolean } = {}
): Promise<ChapterListItem[]> {
  if (!isSlug(slug)) return [];
  const entries = await getChapters(slug);
  const ordered = newestFirst ? [...entries].reverse() : entries;
  return ordered.slice(offset, offset + limit).map((e) => ({ number: e.n, title: e.title }));
}

/** Chương nhỏ nhất — đích của nút "Đọc từ đầu". */
export async function fetchFirstChapterNumber(slug: string): Promise<number | null> {
  if (!isSlug(slug)) return null;
  return (await getChapters(slug))[0]?.n ?? null;
}

/** Một chương + hàng xóm + tổng số chương (để hiện "chương N / M"). */
export async function fetchChapter(slug: string, number: number): Promise<ChapterView | null> {
  if (!isSlug(slug) || !Number.isInteger(number) || number < 1) return null;

  const [index, entries] = await Promise.all([getIndex(), getChapters(slug)]);
  const novel = index.novels.find((n) => n.slug === slug);
  const entry = entries.find((e) => e.n === number);
  if (!novel || !entry) return null;

  const content = await readText(chapterPath(slug, number));
  if (content === null) return null;

  const at = entries.indexOf(entry);
  return {
    novel: { slug, title: novel.title },
    chapter: { number, title: entry.title, content },
    prevNumber: entries[at - 1]?.n ?? null,
    nextNumber: entries[at + 1]?.n ?? null,
    nextTitle: entries[at + 1]?.title ?? null,
    total: entries[entries.length - 1].n,
  };
}

/** Thẻ truyện theo danh sách slug, giữ đúng thứ tự đầu vào (slug không còn trong index thì bỏ). */
export async function fetchNovelCards(slugs: string[]): Promise<NovelCard[]> {
  const { novels } = await getIndex();
  const bySlug = new Map(novels.map((n) => [n.slug, n]));
  return slugs.flatMap((slug) => {
    const novel = bySlug.get(slug);
    return novel ? [toCard(novel)] : [];
  });
}

export type GenreTile = Genre & { count: number; covers: NovelCard[] };

/** Ô thể loại: số truyện + vài bìa thật để ghép — lấy hết từ index.json, không gọi thêm GitHub. */
export async function fetchGenreTiles(): Promise<GenreTile[]> {
  const { genres, novels } = await getIndex();
  return [...genres]
    .sort((a, b) => a.name.localeCompare(b.name, "vi"))
    .map((genre) => {
      const list = novels.filter((n) => n.genres.includes(genre.slug));
      return { ...genre, count: list.length, covers: list.slice(0, 3).map(toCard) };
    });
}

/** Toàn bộ truyện dạng thẻ (index đã nhỏ và được cache) — cho tủ truyện ghép với state. */
export async function fetchAllNovelCards(): Promise<NovelCard[]> {
  const { novels } = await getIndex();
  return novels.map(toCard);
}
