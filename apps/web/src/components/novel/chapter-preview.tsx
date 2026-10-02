import { ChapterList } from "./chapter-list";

import { fetchChapterList } from "@/lib/queries";

/**
 * Danh sách chương tách riêng để bọc `<Suspense>`: trang chi tiết await phần
 * kiểm tra tồn tại trước (để `notFound()` ra đúng 404), rồi mới stream phần này.
 * Dùng `loading.tsx` sẽ khiến Next flush 200 trước khi biết là 404 — soft-404.
 */
export async function ChapterPreview({
  slug,
  novelId,
  limit = 50,
}: {
  slug: string;
  novelId: string;
  limit?: number;
}) {
  const chapters = await fetchChapterList(novelId, {
    limit,
    offset: 0,
    newestFirst: true,
  });

  if (chapters.length === 0) {
    return <p className="text-sm text-ink-3">Truyện chưa có chương nào.</p>;
  }

  return <ChapterList slug={slug} chapters={chapters} />;
}
