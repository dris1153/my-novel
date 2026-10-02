import { notFound } from "next/navigation";
import { Suspense } from "react";

import { GenreList } from "@/components/novel/genre-list";
import { NovelGridSkeleton } from "@/components/novel/novel-grid-skeleton";
import { PageCrumbs } from "@/components/ui/page-nav";
import { fetchGenre } from "@/lib/queries";

export const revalidate = 600;

function readPage(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 2 ? n : null;
}

export async function generateMetadata({ params }: PageProps<"/the-loai/[slug]/trang/[page]">) {
  const { slug, page } = await params;
  const genre = await fetchGenre(slug);
  if (!genre) return { title: "Thể loại" };

  return {
    title: `${genre.name} — trang ${page}`,
    description: `Truyện thể loại ${genre.name}, trang ${page}.`,
    alternates: { canonical: `/the-loai/${genre.slug}/trang/${page}` },
  };
}

export default async function GenrePagedPage({ params }: PageProps<"/the-loai/[slug]/trang/[page]">) {
  const { slug, page } = await params;
  const current = readPage(page);
  if (current === null) notFound();

  const genre = await fetchGenre(slug);
  if (!genre) notFound();

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 pt-10">
      <PageCrumbs items={[{ href: "/the-loai", label: "Thể loại" }, { label: genre.name }]} />
      <h1 className="font-serif text-[32px] leading-[1.12] text-ink">
        {genre.name} <span className="text-ink-3">— trang {current}</span>
      </h1>
      <Suspense fallback={<NovelGridSkeleton />}>
        <GenreList slug={genre.slug} page={current} />
      </Suspense>
    </main>
  );
}
