import { NovelGrid } from "./novel-card";

import { pagedHref, PageNav } from "@/components/ui/page-nav";
import type { NovelCard } from "@/lib/queries";

export const PAGE_SIZE = 24;

/** Lưới có phân trang dùng chung cho thể loại và `/danh-sach/*`; `load` lấy một trang từ index. */
export async function PagedNovelGrid({
  load,
  basePath,
  page,
  empty,
}: {
  load: (limit: number, offset: number) => Promise<NovelCard[]>;
  basePath: string;
  page: number;
  empty: React.ReactNode;
}) {
  // Lấy dư 1 để biết còn trang sau, khỏi tốn query đếm.
  const rows = await load(PAGE_SIZE + 1, (page - 1) * PAGE_SIZE);
  const hasMore = rows.length > PAGE_SIZE;
  const novels = rows.slice(0, PAGE_SIZE);

  if (novels.length === 0) return empty;

  return (
    <div>
      <NovelGrid novels={novels} priorityCount={page === 1 ? 6 : 0} />
      <PageNav page={page} hasMore={hasMore} hrefFor={(target) => pagedHref(basePath, target)} />
    </div>
  );
}
