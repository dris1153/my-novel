import { ChapterList } from "./chapter-list";

import { fetchChapterList } from "@/lib/queries";
import { readMyStateOrEmpty } from "@/lib/state-store";

/**
 * Danh sách chương tách riêng để bọc `<Suspense>`: trang chi tiết await phần
 * kiểm tra tồn tại trước (để `notFound()` ra đúng 404), rồi mới stream phần này.
 * Dùng `loading.tsx` sẽ khiến Next flush 200 trước khi biết là 404 — soft-404.
 */
export async function ChapterPreview({ slug, limit = 5 }: { slug: string; limit?: number }) {
  const [chapters, state] = await Promise.all([
    fetchChapterList(slug, { limit, offset: 0, newestFirst: true }),
    readMyStateOrEmpty(),
  ]);

  if (chapters.length === 0) {
    return <p className="py-6 text-sm text-fg-2">Truyện chưa có chương nào.</p>;
  }

  return <ChapterList slug={slug} chapters={chapters} current={state.progress[slug]?.chapter ?? null} />;
}
