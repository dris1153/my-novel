import Link from "next/link";

import { cn } from "@/lib/cn";
import type { ChapterListItem } from "@/lib/queries";

/** Một dòng chương: ô số + tên; chương đang đọc làm nổi, chương đã qua mờ đi. */
function ChapterRow({
  slug,
  chapter,
  current,
}: {
  slug: string;
  chapter: ChapterListItem;
  current: number | null;
}) {
  const reading = chapter.number === current;
  const read = current !== null && chapter.number < current;

  return (
    <li className="border-b border-line last:border-b-0">
      <Link
        href={`/truyen/${slug}/chuong/${chapter.number}`}
        aria-current={reading ? "true" : undefined}
        className={cn(
          "group -mx-2 my-1 flex min-h-12 items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-hover",
          reading && "bg-accent-soft"
        )}>
        <span
          className={cn(
            "grid h-9 min-w-11 shrink-0 place-items-center rounded-xl px-2 text-sm font-bold tabular-nums",
            reading ? "bg-accent text-on-accent" : "bg-tint-lavender text-accent-fg"
          )}>
          {chapter.number}
        </span>
        <span className={cn("min-w-0 flex-1 truncate text-[15px]", read ? "text-fg-3" : "text-fg")}>
          {chapter.title || `Chương ${chapter.number}`}
        </span>
        {reading && <span className="shrink-0 text-xs font-semibold text-accent-fg">Đang đọc</span>}
      </Link>
    </li>
  );
}

/** Vài chương mới nhất ở trang chi tiết. */
export function ChapterList({
  slug,
  chapters,
  current = null,
}: {
  slug: string;
  chapters: ChapterListItem[];
  current?: number | null;
}) {
  return (
    <ol>
      {chapters.map((chapter) => (
        <ChapterRow key={chapter.number} slug={slug} chapter={chapter} current={current} />
      ))}
    </ol>
  );
}

/** Mục lục đầy đủ — hai cột trên màn rộng, thứ tự đọc (tăng dần). */
export function ChapterToc({
  slug,
  chapters,
  current = null,
}: {
  slug: string;
  chapters: ChapterListItem[];
  current?: number | null;
}) {
  return (
    <ol className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10">
      {chapters.map((chapter) => (
        <ChapterRow key={chapter.number} slug={slug} chapter={chapter} current={current} />
      ))}
    </ol>
  );
}
