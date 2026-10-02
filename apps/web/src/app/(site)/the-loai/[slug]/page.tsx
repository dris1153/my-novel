import { notFound } from "next/navigation";
import { Suspense } from "react";

import { GenreList } from "@/components/novel/genre-list";
import { NovelGridSkeleton } from "@/components/novel/novel-grid-skeleton";
import { PageCrumbs } from "@/components/ui/page-nav";
import { fetchGenre } from "@/lib/queries";

export const revalidate = 600;

export async function generateMetadata({ params }: PageProps<"/the-loai/[slug]">) {
  const { slug } = await params;
  const genre = await fetchGenre(slug);
  if (!genre) return { title: "Thể loại" };

  return {
    title: genre.name,
    description: `Truyện thể loại ${genre.name} mới cập nhật.`,
    alternates: { canonical: `/the-loai/${genre.slug}` },
  };
}

export default async function GenrePage({ params }: PageProps<"/the-loai/[slug]">) {
  const { slug } = await params;
  const genre = await fetchGenre(slug);
  if (!genre) notFound();

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 pt-10">
      <PageCrumbs items={[{ href: "/the-loai", label: "Thể loại" }, { label: genre.name }]} />
      <h1 className="font-serif text-[32px] leading-[1.12] text-ink">{genre.name}</h1>
      <Suspense fallback={<NovelGridSkeleton />}>
        <GenreList slug={genre.slug} page={1} />
      </Suspense>
    </main>
  );
}
