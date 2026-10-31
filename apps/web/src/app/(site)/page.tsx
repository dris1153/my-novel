import { connection } from "next/server";

import { ContinueList } from "@/components/home/continue-list";
import { CoverTile } from "@/components/home/cover-tile";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { FlameBadge, HomeHeading, StarBadge } from "@/components/home/home-heading";
import { LibraryCard } from "@/components/home/library-card";
import { PromoCard } from "@/components/home/promo-card";
import { ReadingCard } from "@/components/home/reading-card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";
import { followingRows, readingRows } from "@/lib/library-rows";
import { fetchAllNovelCards } from "@/lib/queries";
import { readMyStateOrEmpty } from "@/lib/state-store";
import { suggestNovels } from "@/lib/suggest";

const LATEST_COUNT = 5;
const MORE_READING = 3;

export default async function HomePage() {
  // Không prerender lúc build (cần GitHub token); khác `force-dynamic` ở chỗ vẫn dùng data cache.
  await connection();
  const [all, state] = await Promise.all([fetchAllNovelCards(), readMyStateOrEmpty()]);
  // Truyện bị crawl lại ngắn hơn thì tiến độ cũ trỏ tới chương không còn: link sẽ 404, nên không mời đọc tiếp.
  const [current, ...others] = readingRows(all, state).filter((row) => (row.chapter ?? 0) <= row.novel.chapterCount);
  const moreReading = others.slice(0, MORE_READING);
  const suggested = suggestNovels(all, state);

  return (
    <main className="mx-auto flex w-full max-w-[1860px] flex-col gap-5 px-4 lg:gap-6 lg:px-6">
      <h1 className="sr-only">Trang chủ</h1>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <HeroCarousel />
        <div className="flex flex-col gap-5 lg:gap-6">
          <ReadingCard row={current} />
          <LibraryCard count={followingRows(all, state).length} className="lg:flex-1" />
        </div>
      </div>

      {all.length === 0 ? (
        <EmptyState
          art="empty-library"
          title="Thư viện còn trống"
          description="Chạy pnpm crawl <url truyenfull> trên máy để thêm truyện."
        />
      ) : (
        // Dưới xl xếp dọc theo thứ tự DOM (thẻ trang trí cuối); từ xl chia 12 cột, thẻ trang trí lên hàng đầu.
        // Khối rỗng thì ẩn và khối kia chiếm cả hàng.
        <div className="grid gap-5 lg:gap-6 xl:grid-cols-12">
          <section className="min-w-0 xl:col-span-7 xl:row-start-1">
            <HomeHeading
              icon={<FlameBadge />}
              title="Mới cập nhật"
              action={{ href: "/danh-sach/moi-cap-nhat", label: "Xem thêm →" }}
              className="mb-2"
            />
            <ul className="no-scrollbar -mx-4 -my-1 flex snap-x gap-3 overflow-x-auto px-4 py-1 xl:mx-0 xl:grid xl:grid-cols-5 xl:overflow-visible xl:px-0">
              {all.slice(0, LATEST_COUNT).map((novel) => (
                <li key={novel.slug} className="w-[136px] shrink-0 snap-start xl:w-auto">
                  <CoverTile novel={novel} sizes="(min-width:1280px) 150px, 136px" />
                </li>
              ))}
            </ul>
          </section>

          {moreReading.length > 0 && (
            <ContinueList rows={moreReading} className={suggested.length > 0 ? "xl:col-span-5" : "xl:col-span-12"} />
          )}

          {suggested.length > 0 && (
            <section className={cn("min-w-0 rounded-card bg-surface p-5 lg:p-6", moreReading.length > 0 ? "xl:col-span-7" : "xl:col-span-12")}>
              <HomeHeading
                icon={<StarBadge />}
                title="Gợi ý cho bạn"
                action={{ href: "/the-loai", label: "Xem thêm →" }}
                className="mb-2"
              />
              <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {suggested.map((novel) => (
                  <li key={novel.slug}>
                    <CoverTile novel={novel} sizes="(min-width:1024px) 150px, 33vw" />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <PromoCard className="xl:col-span-5 xl:col-start-8 xl:row-start-1" />
        </div>
      )}
    </main>
  );
}
