import { connection } from "next/server";

import { SearchForm } from "@/components/chrome/search-form";
import { GenrePanel } from "@/components/home/genre-panel";
import { HeroCarousel, type HeroSlide } from "@/components/home/hero-carousel";
import { LatestList } from "@/components/home/latest-list";
import { ShortcutGrid } from "@/components/home/shortcut-grid";
import { ContinueReading } from "@/components/novel/continue-reading";
import { Shelf } from "@/components/novel/shelf";
import { EmptyState } from "@/components/ui/empty-state";
import { fetchAllNovelCards, fetchGenreTiles } from "@/lib/queries";

const SHELF_SIZE = 8;
const LATEST_ROWS = 12;
const MIN_FOR_SHELF = 4;
const BANNERS = 4;

export default async function HomePage() {
  // Không prerender lúc build (cần GitHub token); khác `force-dynamic` ở chỗ vẫn dùng data cache.
  await connection();
  const [all, tiles] = await Promise.all([fetchAllNovelCards(), fetchGenreTiles()]);
  const genreNames = new Map(tiles.map((tile) => [tile.slug, tile.name]));
  const completed = all.filter((novel) => novel.status === "completed");

  // `featured` bật tay trong repo dữ liệu; chưa có thì lấy truyện mới cập nhật.
  const featured = all.filter((novel) => novel.featured);
  const slides: HeroSlide[] = (featured.length > 0 ? featured.slice(0, BANNERS) : all.slice(0, BANNERS)).map((novel, i) => ({
    slug: novel.slug,
    title: novel.title,
    author: novel.author,
    genre: genreNames.get(novel.genres[0] ?? "") ?? null,
    coverUrl: novel.coverUrl,
    coverColor: novel.coverColor,
    banner: `/art/banner-${(i % BANNERS) + 1}.webp`,
  }));

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 pt-4 lg:gap-6 lg:px-6 lg:pt-6">
      <h1 className="sr-only">Trang chủ</h1>

      {all.length === 0 ? (
        <EmptyState
          art="empty-library"
          title="Thư viện còn trống"
          description="Chạy pnpm crawl <url truyenfull> trên máy để thêm truyện."
        />
      ) : (
        <>
          {/* Điện thoại: xếp dọc theo thứ tự DOM. Màn rộng: [thể loại | carousel | đang đọc]; ô tìm + lối tắt ẩn vì header đã có. */}
          <div className="flex flex-col gap-4 lg:grid lg:auto-cols-[300px] lg:grid-flow-col lg:grid-cols-[220px_minmax(0,1fr)]">
            <GenrePanel genres={tiles.filter((tile) => tile.count > 0)} className="hidden lg:block lg:h-0 lg:min-h-full" />
            <HeroCarousel slides={slides} />
            <SearchForm className="lg:hidden" />
            <ContinueReading className="lg:self-start" />
            <ShortcutGrid className="lg:hidden" />
          </div>

          <div className="lg:hidden">
            <Shelf
              title="Truyện mới cập nhật"
              novels={all.slice(0, SHELF_SIZE)}
              action={{ href: "/danh-sach/moi-cap-nhat", label: "Thêm →" }}
            />
          </div>
          <LatestList
            novels={all.slice(0, LATEST_ROWS)}
            genreNames={genreNames}
            className="hidden rounded-card bg-surface p-5 lg:block"
          />

          <p className="flex items-center gap-3 text-sm text-fg-2 before:h-px before:flex-1 before:bg-line after:h-px after:flex-1 after:bg-line">
            Đọc truyện chữ, không quảng cáo
          </p>

          {completed.length >= MIN_FOR_SHELF && (
            <Shelf
              title="Truyện hoàn thành"
              novels={completed.slice(0, SHELF_SIZE)}
              action={{ href: "/danh-sach/hoan-thanh", label: "Thêm →" }}
            />
          )}
        </>
      )}
    </main>
  );
}
