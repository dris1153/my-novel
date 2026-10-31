import { GenreListing } from "@/components/genre/genre-listing";
import { fetchGenre } from "@/lib/queries";

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
  return <GenreListing slug={slug} page={1} />;
}
