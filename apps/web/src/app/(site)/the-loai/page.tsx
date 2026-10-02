import Link from "next/link";

import { DoodleCompass } from "@/components/doodles";
import { SectionHeading } from "@/components/ui/section-heading";
import { fetchGenres } from "@/lib/queries";

export const revalidate = 3600;

export const metadata = {
  title: "Thể loại",
  description: "Duyệt truyện theo thể loại: tiên hiệp, kiếm hiệp, ngôn tình, trinh thám và hơn thế.",
  alternates: { canonical: "/the-loai" },
};

export default async function GenresPage() {
  const genres = await fetchGenres();

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 pt-12">
      <div className="relative">
        <DoodleCompass size={72} rotate={-10} className="mx-auto" wash />
        <SectionHeading
          title="Thể loại"
          subtitle="Chọn một thể loại để xem danh sách truyện."
          className="mt-6"
        />
      </div>

      {genres.length === 0 ? (
        <p className="mt-14 text-center text-sm text-ink-3">Chưa có thể loại nào.</p>
      ) : (
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {genres.map((genre) => (
            <li key={genre.slug}>
              <Link
                href={`/the-loai/${genre.slug}`}
                className="flex items-center justify-between rounded-lg border border-line px-4 py-3 font-serif text-[18px] text-ink transition-colors hover:border-ink">
                {genre.name}
                <span aria-hidden className="text-ink-3">
                  ›
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
