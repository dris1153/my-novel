import { NovelGridCard } from "./novel-card";

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
    return <p className="mt-10 text-sm text-ink-3">Chưa có truyện nào trong thể loại này.</p>;
  }

  return (
    <>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        {novels.map((novel) => (
          <NovelGridCard key={novel.id} novel={novel} />
        ))}
      </div>

      <PageNav
        page={page}
        hasMore={hasMore}
        hrefFor={(target) => pagedHref(`/the-loai/${slug}`, target)}
      />
    </>
  );
}
