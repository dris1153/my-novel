import Link from "next/link";
import { timeAgo } from "shared";

import type { ChapterListItem } from "@/lib/queries";

/** Danh sách chương (mới nhất trước) — 50 dòng đầu ở trang chi tiết. */
export function ChapterList({
  slug,
  chapters,
  showTime = true,
}: {
  slug: string;
  chapters: ChapterListItem[];
  showTime?: boolean;
}) {
  return (
    <ol className="border-t border-line">
      {chapters.map((chapter) => (
        <li key={chapter.id} className="border-b border-line">
          <Link
            href={`/truyen/${slug}/chuong/${chapter.number}`}
            className="group flex items-baseline justify-between gap-4 py-3">
            <span className="truncate text-sm text-ink transition-colors group-hover:text-sepia-text">
              Chương {chapter.number} — {chapter.title}
            </span>
            {showTime && (
              <span className="shrink-0 text-xs text-ink-3">{timeAgo(chapter.created_at)}</span>
            )}
          </Link>
        </li>
      ))}
    </ol>
  );
}

/** Mục lục đầy đủ — hai cột, thứ tự đọc (tăng dần). */
export function ChapterToc({ slug, chapters }: { slug: string; chapters: ChapterListItem[] }) {
  return (
    <ol className="mt-6 grid border-t border-line sm:grid-cols-2 sm:gap-x-8">
      {chapters.map((chapter) => (
        <li key={chapter.id} className="border-b border-line">
          <Link
            href={`/truyen/${slug}/chuong/${chapter.number}`}
            className="group flex items-baseline gap-2 py-2.5">
            <span className="shrink-0 text-xs text-ink-3">{chapter.number}.</span>
            <span className="truncate text-sm text-ink transition-colors group-hover:text-sepia-text">
              {chapter.title}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
