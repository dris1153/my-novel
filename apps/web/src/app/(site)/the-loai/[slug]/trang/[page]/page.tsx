import { notFound } from "next/navigation";
import { Suspense } from "react";

import { GenreChips } from "@/components/novel/genre-chips";
import { GenreEmpty } from "@/components/novel/genre-empty";
import { NovelGridSkeleton } from "@/components/novel/novel-grid-skeleton";
import { PagedNovelGrid } from "@/components/novel/paged-novel-grid";
import { parsePageParam } from "@/components/ui/page-nav";
import { fetchByGenre, fetchGenre, fetchGenreTiles } from "@/lib/queries";

export const revalidate = 600;

export async function generateMetadata({ params }: PageProps<"/the-loai/[slug]/trang/[page]">) {
  const { slug, page } = await params;
  const genre = await fetchGenre(slug);
  if (!genre) return { title: "Thể loại" };

  return {
    title: `${genre.name} — trang ${page}`,
    description: `Truyện thể loại ${genre.name}, trang ${page}.`,
  };
}

export default async function GenrePagedPage({ params }: PageProps<"/the-loai/[slug]/trang/[page]">) {
  const { slug, page } = await params;
  const current = parsePageParam(page);
  if (current === null) notFound();

  const [genre, tiles] = await Promise.all([fetchGenre(slug), fetchGenreTiles()]);
  if (!genre) notFound();

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 pt-4 lg:px-6 lg:pt-6">
      <h1 className="border-l-4 border-accent pl-3 font-heading text-2xl font-bold text-fg lg:text-3xl">
        {genre.name} <span className="text-fg-2">· trang {current}</span>
      </h1>
      <div className="mt-4">
        <GenreChips genres={tiles.filter((tile) => tile.count > 0)} activeSlug={genre.slug} />
      </div>
      <Suspense fallback={<NovelGridSkeleton />}>
        <PagedNovelGrid
          load={(limit, offset) => fetchByGenre(genre.slug, limit, offset)}
          basePath={`/the-loai/${genre.slug}`}
          page={current}
          empty={<GenreEmpty />}
        />
      </Suspense>
    </main>
  );
}
