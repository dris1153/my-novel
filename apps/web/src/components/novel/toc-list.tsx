import { ChapterToc } from "./chapter-list";

import { pagedHref, PageNav } from "@/components/ui/page-nav";
import { fetchChapterList } from "@/lib/queries";

export const TOC_PAGE_SIZE = 100;

/** Mục lục đầy đủ theo thứ tự đọc, phân trang để truyện 2000+ chương không khựng. */
export async function TocList({
  slug,
  novelId,
  page,
}: {
  slug: string;
  novelId: string;
  page: number;
}) {
  const offset = (page - 1) * TOC_PAGE_SIZE;
  const rows = await fetchChapterList(novelId, {
    limit: TOC_PAGE_SIZE + 1,
    offset,
    newestFirst: false,
  });
  const hasMore = rows.length > TOC_PAGE_SIZE;
  const chapters = rows.slice(0, TOC_PAGE_SIZE);

  if (chapters.length === 0) {
    return <p className="mt-6 text-sm text-ink-3">Chưa có chương nào.</p>;
  }

  return (
    <>
      <ChapterToc slug={slug} chapters={chapters} />
      <PageNav
        page={page}
        hasMore={hasMore}
        hrefFor={(target) => pagedHref(`/truyen/${slug}/muc-luc`, target)}
      />
    </>
  );
}
