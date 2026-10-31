import Link from "next/link";

import { cn } from "@/lib/cn";
import type { ChapterListItem } from "@/lib/queries";

/** Một dòng chương: số + tên; chương đang đọc làm nổi, chương đã qua mờ đi. */
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
    <li className="border-b border-line">
      <Link
        href={`/truyen/${slug}/chuong/${chapter.number}`}
        aria-current={reading ? "true" : undefined}
        className={cn(
          "group -mx-2 flex min-h-12 items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-hover",
          reading && "bg-accent-soft"
        )}>
        <span className={cn("w-12 shrink-0 text-xs tabular-nums", read ? "text-fg-3" : "text-fg-2")}>
          {chapter.number}
        </span>
        <span className={cn("min-w-0 flex-1 truncate text-sm", read ? "text-fg-3" : "text-fg")}>
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
    <ol className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8">
      {chapters.map((chapter) => (
        <ChapterRow key={chapter.number} slug={slug} chapter={chapter} current={current} />
      ))}
    </ol>
  );
}
