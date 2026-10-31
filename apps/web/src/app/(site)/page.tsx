import { connection } from "next/server";

import { ContinueReading } from "@/components/novel/continue-reading";
import { GenreChips } from "@/components/novel/genre-chips";
import { NovelGrid } from "@/components/novel/novel-card";
import { Shelf } from "@/components/novel/shelf";
import { WelcomeBanner } from "@/components/novel/welcome-banner";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import { fetchGenreTiles, fetchRecent } from "@/lib/queries";

const SHELF_SIZE = 8;
const MIN_FOR_SHELF = 3;

export default async function HomePage() {
  // Không prerender lúc build (cần GitHub token); khác `force-dynamic` ở chỗ vẫn dùng data cache.
  await connection();
  const [recent, tiles] = await Promise.all([fetchRecent(500, 0), fetchGenreTiles()]);
  const genres = tiles.filter((tile) => tile.count > 0);
  // Kệ đã xếp theo cập nhật mới nhất; lưới "Tất cả" xếp theo tên để hai khối không trùng thứ tự.
  const all = [...recent].sort((a, b) => a.title.localeCompare(b.title, "vi"));

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 pt-4 lg:gap-10 lg:px-6 lg:pt-8">
      <h1 className="sr-only">Trang chủ</h1>
      <ContinueReading fallback={<WelcomeBanner />} />

      <GenreChips genres={genres} />

      {recent.length === 0 ? (
        <EmptyState
          art="empty-library"
          title="Thư viện còn trống"
          description="Chạy pnpm crawl <url truyenfull> trên máy để thêm truyện."
        />
      ) : (
        <>
          {recent.length >= MIN_FOR_SHELF && (
            <Shelf
              title="Mới cập nhật"
              novels={recent.slice(0, SHELF_SIZE)}
              action={{ href: "#tat-ca", label: "Xem tất cả" }}
            />
          )}

          <section id="tat-ca" className="scroll-mt-20">
            <SectionHeading title="Tất cả truyện" className="mb-3" />
            <NovelGrid novels={all} priorityCount={6} />
          </section>
        </>
      )}
    </main>
  );
}
