import Link from "next/link";

import { BookBadge, HomeHeading, PlayIcon } from "./home-heading";
import { ReadingProgress } from "./reading-progress";

import { NovelCover } from "@/components/novel/novel-cover";
import type { LibraryRow } from "@/lib/library-rows";
import type { NovelCard } from "@/lib/queries";

/** "Đang đọc": truyện đọc gần nhất; không có thì mời chọn truyện, để cột phải không lệch với banner. */
export function ReadingCard({ row }: { row?: LibraryRow<NovelCard> }) {
  if (!row) {
    return (
      <section className="rounded-card bg-tint-lavender p-5">
        <HomeHeading icon={<BookBadge />} title="Đang đọc" />
        <p className="mt-1 text-sm text-fg-2">Chưa có truyện để đọc tiếp. Chọn một truyện nhé.</p>
        <Link
          href="/danh-sach/moi-cap-nhat"
          className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-5 text-sm font-bold text-fg hover:bg-hover">
          <PlayIcon />
          Chọn truyện
        </Link>
      </section>
    );
  }

  const { novel } = row;
  // `readingRows` chỉ trả truyện có tiến độ nên `chapter` luôn có.
  const chapter = row.chapter ?? 1;

  return (
    <section className="rounded-card bg-tint-lavender p-5">
      <HomeHeading icon={<BookBadge />} title="Đang đọc" action={{ href: "/tu-truyen?tab=dang-doc", label: "Tất cả →" }} />
      <div className="mt-2 flex gap-4">
        <Link href={`/truyen/${novel.slug}`} className="w-[84px] shrink-0">
          <NovelCover uri={novel.coverUrl} title={novel.title} seed={novel.slug} color={novel.coverColor} sizes="84px" />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <Link href={`/truyen/${novel.slug}`} className="line-clamp-2 font-heading text-[17px] leading-snug font-extrabold text-fg hover:text-accent-fg">
            {novel.title}
          </Link>
          <p className="mt-1 text-sm text-fg-2">
            Chương {chapter} / {novel.chapterCount}
          </p>
          <ReadingProgress chapter={chapter} total={novel.chapterCount} className="mt-2" />
          <Link
            href={`/truyen/${novel.slug}/chuong/${chapter}`}
            className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 self-stretch rounded-full bg-surface text-sm font-bold text-fg hover:bg-hover">
            <PlayIcon />
            Tiếp tục đọc
          </Link>
        </div>
      </div>
    </section>
  );
}
