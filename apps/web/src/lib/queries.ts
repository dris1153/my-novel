import type { Chapter, Novel } from "shared";

import { hasSupabaseConfig } from "./supabase/config";
import { createPublicClient } from "./supabase/public";

/** Cột cho thẻ/lưới — không lấy `description` cho nhẹ. */
const CARD = "id, slug, title, author, cover_url, status, view_count, updated_at, featured";

export type NovelCard = Pick<
  Novel,
  | "id"
  | "slug"
  | "title"
  | "author"
  | "cover_url"
  | "status"
  | "view_count"
  | "updated_at"
  | "featured"
> & { chapters: { count: number }[] };

export type NovelDetail = Novel & {
  novel_genres: { genres: { slug: string; name: string } | null }[];
  chapters: { count: number }[];
};

export type FeaturedNovel = NovelCard & Pick<Novel, "description">;

export type ChapterListItem = Pick<Chapter, "id" | "number" | "title" | "created_at">;

export type Genre = { id: number; slug: string; name: string };

const db = () => createPublicClient();

function unwrap<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  if (data === null) throw new Error("Không tìm thấy dữ liệu");
  return data;
}

export function chapterCount(novel: NovelCard): number {
  return novel.chapters?.[0]?.count ?? 0;
}

/** Truyện đang đề cử; chưa gắn cờ nào thì lấy truyện nhiều lượt đọc nhất. */
export async function fetchFeatured(): Promise<FeaturedNovel | null> {
  if (!hasSupabaseConfig) return null;
  const client = db();

  const { data: featured } = await client
    .from("novels")
    .select(`${CARD}, description, chapters(count)`)
    .eq("published", true)
    .eq("featured", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .returns<FeaturedNovel[]>();

  if (featured && featured.length > 0) return featured[0];

  const { data: top } = await client
    .from("novels")
    .select(`${CARD}, description, chapters(count)`)
    .eq("published", true)
    .order("view_count", { ascending: false })
    .limit(1)
    .returns<FeaturedNovel[]>();

  return top?.[0] ?? null;
}

export async function fetchPopular(limit = 12): Promise<NovelCard[]> {
  if (!hasSupabaseConfig) return [];
  return unwrap(
    await db()
      .from("novels")
      .select(`${CARD}, chapters(count)`)
      .eq("published", true)
      .order("view_count", { ascending: false })
      .limit(limit)
      .returns<NovelCard[]>()
  );
}

export async function fetchRecent(limit = 24, offset = 0): Promise<NovelCard[]> {
  if (!hasSupabaseConfig) return [];
  return unwrap(
    await db()
      .from("novels")
      .select(`${CARD}, chapters(count)`)
      .eq("published", true)
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1)
      .returns<NovelCard[]>()
  );
}

export async function fetchGenres(): Promise<Genre[]> {
  if (!hasSupabaseConfig) return [];
  return unwrap(
    await db().from("genres").select("id, slug, name").order("name").returns<Genre[]>()
  );
}

/** Cho sitemap: chỉ slug + lần cập nhật, không kéo cả bảng nặng. */
export async function fetchAllNovelPaths(): Promise<{ slug: string; updated_at: string }[]> {
  if (!hasSupabaseConfig) return [];
  const { data } = await db()
    .from("novels")
    .select("slug, updated_at")
    .eq("published", true)
    .order("updated_at", { ascending: false })
    .limit(5000)
    .returns<{ slug: string; updated_at: string }[]>();
  return data ?? [];
}

export async function fetchGenre(slug: string): Promise<Genre | null> {
  if (!hasSupabaseConfig) return null;
  const { data } = await db()
    .from("genres")
    .select("id, slug, name")
    .eq("slug", slug)
    .maybeSingle()
    .returns<Genre>();
  return data ?? null;
}

export async function fetchByGenre(slug: string, limit = 24, offset = 0): Promise<NovelCard[]> {
  if (!hasSupabaseConfig) return [];
  return unwrap(
    await db()
      .from("novels")
      .select(`${CARD}, chapters(count), novel_genres!inner(genres!inner(slug))`)
      .eq("published", true)
      .eq("novel_genres.genres.slug", slug)
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1)
      .returns<NovelCard[]>()
  );
}

/** Bỏ ký tự phá cú pháp `.or()` của PostgREST. */
function sanitizeTerm(term: string) {
  return term.trim().replace(/[,()%\\]/g, " ").replace(/\s+/g, " ").trim();
}

export async function searchNovels(term: string, limit = 24, offset = 0): Promise<NovelCard[]> {
  const q = sanitizeTerm(term);
  if (!hasSupabaseConfig || !q) return [];
  return unwrap(
    await db()
      .from("novels")
      .select(`${CARD}, chapters(count)`)
      .eq("published", true)
      .or(`title.ilike.%${q}%,author.ilike.%${q}%`)
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1)
      .returns<NovelCard[]>()
  );
}

export async function fetchNovel(slug: string): Promise<NovelDetail | null> {
  if (!hasSupabaseConfig) return null;
  const { data } = await db()
    .from("novels")
    .select("*, chapters(count), novel_genres(genres(slug, name))")
    .eq("slug", slug)
    .maybeSingle()
    .returns<NovelDetail>();
  return data ?? null;
}

export type NovelSummary = {
  id: string;
  slug: string;
  title: string;
  cover_url: string | null;
  chapters: { count: number }[];
};

/** Tra theo id — dùng để hiện tên + số chương của các job crawl đang chạy. */
export async function fetchNovelSummaries(ids: string[]): Promise<NovelSummary[]> {
  if (!hasSupabaseConfig || ids.length === 0) return [];
  const { data } = await db()
    .from("novels")
    .select("id, slug, title, cover_url, chapters(count)")
    .in("id", ids)
    .returns<NovelSummary[]>();
  return data ?? [];
}

export async function fetchChapterList(
  novelId: string,
  { limit = 50, offset = 0, newestFirst = true }: { limit?: number; offset?: number; newestFirst?: boolean } = {}
): Promise<ChapterListItem[]> {
  if (!hasSupabaseConfig) return [];
  return unwrap(
    await db()
      .from("chapters")
      .select("id, number, title, created_at")
      .eq("novel_id", novelId)
      .eq("published", true)
      .order("number", { ascending: !newestFirst })
      .range(offset, offset + limit - 1)
      .returns<ChapterListItem[]>()
  );
}

export async function fetchChapterCount(novelId: string): Promise<number> {
  if (!hasSupabaseConfig) return 0;
  const { count } = await db()
    .from("chapters")
    .select("id", { count: "exact", head: true })
    .eq("novel_id", novelId)
    .eq("published", true);
  return count ?? 0;
}

/** Chương nhỏ nhất — đích của nút "Đọc từ đầu". */
export async function fetchFirstChapterNumber(novelId: string): Promise<number | null> {
  if (!hasSupabaseConfig) return null;
  const { data } = await db()
    .from("chapters")
    .select("number")
    .eq("novel_id", novelId)
    .eq("published", true)
    .order("number", { ascending: true })
    .limit(1)
    .maybeSingle()
    .returns<{ number: number }>();
  return data?.number ?? null;
}

export type ChapterView = {
  novel: Pick<Novel, "id" | "slug" | "title">;
  chapter: Pick<Chapter, "id" | "number" | "title" | "content" | "word_count">;
  hasPrev: boolean;
  hasNext: boolean;
  total: number;
};

/** Một chương đã đăng + hàng xóm + tổng số chương (để hiện "chương N / M"). */
export async function fetchChapter(
  novelSlug: string,
  number: number
): Promise<ChapterView | null> {
  if (!hasSupabaseConfig) return null;
  const client = db();

  const { data: novel } = await client
    .from("novels")
    .select("id, slug, title")
    .eq("slug", novelSlug)
    .eq("published", true)
    .maybeSingle()
    .returns<Pick<Novel, "id" | "slug" | "title">>();
  if (!novel) return null;

  const { data: chapter } = await client
    .from("chapters")
    .select("id, number, title, content, word_count")
    .eq("novel_id", novel.id)
    .eq("number", number)
    .eq("published", true)
    .maybeSingle()
    .returns<Pick<Chapter, "id" | "number" | "title" | "content" | "word_count">>();
  if (!chapter) return null;

  const [{ data: neighbours }, { count }] = await Promise.all([
    client
      .from("chapters")
      .select("number")
      .eq("novel_id", novel.id)
      .eq("published", true)
      .in("number", [number - 1, number + 1]),
    client
      .from("chapters")
      .select("id", { count: "exact", head: true })
      .eq("novel_id", novel.id)
      .eq("published", true),
  ]);

  const numbers = new Set((neighbours ?? []).map((row) => row.number));

  return {
    novel,
    chapter,
    hasPrev: numbers.has(number - 1),
    hasNext: numbers.has(number + 1),
    total: count ?? 0,
  };
}
