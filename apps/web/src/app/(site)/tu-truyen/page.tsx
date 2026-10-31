import Link from "next/link";

import { LibraryRow } from "@/components/novel/library-row";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";
import { followingRows, readingRows } from "@/lib/library-rows";
import { fetchAllNovelCards } from "@/lib/queries";
import { readMyState } from "@/lib/state-store";

export const metadata = {
  title: "Tủ truyện",
  robots: { index: false, follow: true },
};

type Tab = "dang-doc" | "theo-doi";

export default async function LibraryPage({ searchParams }: PageProps<"/tu-truyen">) {
  // Lỗi đọc state ở đây phải hiện ra: tủ truyện rỗng trông như mất dữ liệu.
  const [state, cards, sp] = await Promise.all([readMyState(), fetchAllNovelCards(), searchParams]);
  const reading = readingRows(cards, state);
  const following = followingRows(cards, state);

  const requested = sp.tab === "theo-doi" || sp.tab === "dang-doc" ? (sp.tab as Tab) : null;
  const tab: Tab = requested ?? (reading.length > 0 ? "dang-doc" : "theo-doi");
  const rows = tab === "dang-doc" ? reading : following;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "dang-doc", label: "Đang đọc", count: reading.length },
    { key: "theo-doi", label: "Theo dõi", count: following.length },
  ];

  return (
    <main className="mx-auto w-full max-w-[760px] px-4 pt-6 lg:pt-10">
      <h1 className="font-serif text-2xl font-bold text-fg lg:text-3xl">Tủ truyện</h1>

      <nav aria-label="Lọc tủ truyện" className="mt-4 flex gap-2">
        {tabs.map(({ key, label, count }) => (
          <Link
            key={key}
            href={`/tu-truyen?tab=${key}`}
            aria-current={tab === key ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full px-4 text-sm transition-colors",
              tab === key ? "bg-fg font-semibold text-canvas" : "bg-surface text-fg-2 hover:text-fg"
            )}>
            {label} · {count}
          </Link>
        ))}
      </nav>

      {rows.length === 0 ? (
        <EmptyState
          art="empty-library"
          title={tab === "dang-doc" ? "Chưa đọc truyện nào" : "Tủ truyện còn trống"}
          description={
            tab === "dang-doc"
              ? "Mở một chương bất kỳ, tiến độ sẽ hiện ở đây."
              : "Bấm ♡ ở trang truyện để theo dõi và nhận số chương mới."
          }
          action={{ href: "/", label: "Khám phá truyện" }}
        />
      ) : (
        <ul className="mt-2">
          {rows.map((row) => (
            <LibraryRow key={row.novel.slug} row={row} />
          ))}
        </ul>
      )}
    </main>
  );
}
