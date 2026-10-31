import { notFound } from "next/navigation";

import { GenreListing } from "@/components/genre/genre-listing";
import { parsePageParam } from "@/components/ui/page-nav";
import { fetchGenre } from "@/lib/queries";

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

  return <GenreListing slug={slug} page={current} />;
}
