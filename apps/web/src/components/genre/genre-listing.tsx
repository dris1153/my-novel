import { notFound } from "next/navigation";
import { Suspense } from "react";

import { GenreHeader } from "./genre-header";

import { GenreChips } from "@/components/novel/genre-chips";
import { GenreEmpty } from "@/components/novel/genre-empty";
import { NovelGridSkeleton } from "@/components/novel/novel-grid-skeleton";
import { PAGE_SIZE, PagedNovelGrid } from "@/components/novel/paged-novel-grid";
import { fetchByGenre, fetchGenreTiles } from "@/lib/queries";

/** Thân trang một thể loại, dùng chung cho `/the-loai/[slug]` và `/the-loai/[slug]/trang/[page]`. */
export async function GenreListing({ slug, page }: { slug: string; page: number }) {
  const tiles = await fetchGenreTiles();
  const genre = tiles.find((tile) => tile.slug === slug);
  // Trang vượt quá số truyện là 404, không phải "thể loại chưa có truyện".
  if (!genre || (page > 1 && (page - 1) * PAGE_SIZE >= genre.count)) notFound();

  return (
    <main className="mx-auto flex w-full max-w-[1860px] flex-col gap-5 px-4 lg:px-6">
      <GenreHeader slug={genre.slug} name={genre.name} count={genre.count} page={page} />
      <GenreChips genres={tiles.filter((tile) => tile.count > 0)} activeSlug={genre.slug} />
      <Suspense fallback={<NovelGridSkeleton />}>
        <PagedNovelGrid
          load={(limit, offset) => fetchByGenre(genre.slug, limit, offset)}
          basePath={`/the-loai/${genre.slug}`}
          page={page}
          empty={<GenreEmpty />}
        />
      </Suspense>
    </main>
  );
}
