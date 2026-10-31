import { NovelGrid } from "./novel-card";

import { EmptyState } from "@/components/ui/empty-state";
import { pagedHref, PageNav } from "@/components/ui/page-nav";
import { fetchByGenre } from "@/lib/queries";

export const GENRE_PAGE_SIZE = 24;

/** Dùng chung cho `/the-loai/[slug]` và `/the-loai/[slug]/trang/[page]`. */
export async function GenreList({ slug, page }: { slug: string; page: number }) {
  const offset = (page - 1) * GENRE_PAGE_SIZE;
  // Lấy dư 1 để biết còn trang sau, khỏi tốn query đếm.
  const rows = await fetchByGenre(slug, GENRE_PAGE_SIZE + 1, offset);
  const hasMore = rows.length > GENRE_PAGE_SIZE;
  const novels = rows.slice(0, GENRE_PAGE_SIZE);

  if (novels.length === 0) {
    return (
      <EmptyState
        art="no-results"
        title="Chưa có truyện nào"
        description="Thể loại này chưa có truyện. Thử thể loại khác nhé."
        action={{ href: "/the-loai", label: "Xem thể loại khác" }}
      />
    );
  }

  return (
    <div className="mt-6">
      <NovelGrid novels={novels} priorityCount={page === 1 ? 6 : 0} />
      <PageNav page={page} hasMore={hasMore} hrefFor={(target) => pagedHref(`/the-loai/${slug}`, target)} />
    </div>
  );
}
