import { connection } from "next/server";

import { GenreTile } from "@/components/novel/genre-tile";
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
    <main className="mx-auto w-full max-w-[1200px] px-4 pt-6 lg:px-6 lg:pt-10">
      <h1 className="font-serif text-2xl font-bold text-fg lg:text-3xl">Thể loại</h1>
      <p className="mt-1 text-sm text-fg-2">Chọn một thể loại để xem danh sách truyện.</p>

      {sorted.length === 0 ? (
        <EmptyState art="no-results" title="Chưa có thể loại nào" />
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {sorted.map((tile) => (
            <li key={tile.slug}>
              <GenreTile tile={tile} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
