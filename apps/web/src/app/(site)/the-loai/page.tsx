import Image from "next/image";
import { connection } from "next/server";

import { GenreCard } from "@/components/genre/genre-card";
import { EmptyState } from "@/components/ui/empty-state";
import { fetchGenreTiles } from "@/lib/queries";

export const metadata = {
  title: "Thể loại",
  description: "Duyệt truyện theo thể loại: tiên hiệp, kiếm hiệp, ngôn tình, trinh thám và hơn thế.",
};

export default async function GenresPage() {
  // Không prerender lúc build (cần GitHub token); vẫn dùng data cache.
  await connection();
  const tiles = await fetchGenreTiles();
  // Thể loại có truyện lên trước, giữ thứ tự chữ cái trong mỗi nhóm.
  const sorted = [...tiles].sort((a, b) => Number(b.count > 0) - Number(a.count > 0));

  return (
    <main className="mx-auto flex w-full max-w-[1320px] flex-col gap-5 px-4 lg:gap-6 lg:px-6">
      <section className="relative flex min-h-[160px] flex-col justify-center overflow-hidden rounded-card bg-tint-lavender p-6 pr-36 lg:min-h-[220px] lg:p-10 lg:pr-72">
        <h1 className="font-heading text-4xl font-extrabold text-fg lg:text-[56px] lg:leading-tight">Thể loại</h1>
        <p className="mt-2 text-[15px] text-fg-2 lg:text-lg">Chọn một thể loại để xem danh sách truyện.</p>
        <Image
          src="/art/cat-reading.webp"
          alt=""
          width={200}
          height={240}
          unoptimized
          className="absolute right-4 -bottom-3 w-[120px] lg:right-12 lg:w-[180px]"
        />
      </section>

      {sorted.length === 0 ? (
        <EmptyState art="no-results" title="Chưa có thể loại nào" />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5">
          {sorted.map((tile) => (
            <li key={tile.slug}>
              <GenreCard tile={tile} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
