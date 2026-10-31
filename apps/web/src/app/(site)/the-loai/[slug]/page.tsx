import { notFound } from "next/navigation";
import { Suspense } from "react";

import { GenreChips } from "@/components/novel/genre-chips";
import { GenreEmpty } from "@/components/novel/genre-empty";
import { NovelGridSkeleton } from "@/components/novel/novel-grid-skeleton";
import { PagedNovelGrid } from "@/components/novel/paged-novel-grid";
import { fetchByGenre, fetchGenre, fetchGenreTiles } from "@/lib/queries";

export const revalidate = 600;

export async function generateMetadata({ params }: PageProps<"/the-loai/[slug]">) {
  const { slug } = await params;
  const genre = await fetchGenre(slug);
  if (!genre) return { title: "Thể loại" };

  return {
    title: genre.name,
    description: `Truyện thể loại ${genre.name} mới cập nhật.`,
  };
}

export default async function GenrePage({ params }: PageProps<"/the-loai/[slug]">) {
  const { slug } = await params;
  const [genre, tiles] = await Promise.all([fetchGenre(slug), fetchGenreTiles()]);
  if (!genre) notFound();

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 pt-4 lg:px-6 lg:pt-6">
      <h1 className="border-l-4 border-accent pl-3 font-heading text-2xl font-bold text-fg lg:text-3xl">{genre.name}</h1>
      <div className="mt-4">
        <GenreChips genres={tiles.filter((tile) => tile.count > 0)} activeSlug={genre.slug} />
      </div>
      <Suspense fallback={<NovelGridSkeleton />}>
        <PagedNovelGrid
          load={(limit, offset) => fetchByGenre(genre.slug, limit, offset)}
          basePath={`/the-loai/${genre.slug}`}
          page={1}
          empty={<GenreEmpty />}
        />
      </Suspense>
    </main>
  );
}
