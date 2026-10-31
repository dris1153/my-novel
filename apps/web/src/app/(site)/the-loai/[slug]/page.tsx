import { notFound } from "next/navigation";
import { Suspense } from "react";

import { GenreChips } from "@/components/novel/genre-chips";
import { GenreList } from "@/components/novel/genre-list";
import { NovelGridSkeleton } from "@/components/novel/novel-grid-skeleton";
import { fetchGenre, fetchGenreTiles } from "@/lib/queries";

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
    <main className="mx-auto w-full max-w-[1200px] px-4 pt-6 lg:px-6 lg:pt-10">
      <h1 className="font-serif text-2xl font-bold text-fg lg:text-3xl">{genre.name}</h1>
      <div className="mt-4">
        <GenreChips genres={tiles.filter((tile) => tile.count > 0)} activeSlug={genre.slug} />
      </div>
      <Suspense fallback={<NovelGridSkeleton />}>
        <GenreList slug={genre.slug} page={1} />
      </Suspense>
    </main>
  );
}
