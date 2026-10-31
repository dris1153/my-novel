import Link from "next/link";
import { timeAgo } from "shared";

import { NovelCover } from "./novel-cover";

import { badgeLabel, type LibraryRow as Row } from "@/lib/library-rows";
import type { NovelCard } from "@/lib/queries";

/** Dòng tủ truyện: bìa nhỏ, tiến độ "Chương X / Y", thanh tiến độ, badge chương mới. */
export function LibraryRow({ row }: { row: Row<NovelCard> }) {
  const { novel, chapter, readAt, newCount } = row;
  const href = chapter ? `/truyen/${novel.slug}/chuong/${chapter}` : `/truyen/${novel.slug}`;
  const percent = chapter ? Math.min(100, Math.round((chapter / Math.max(1, novel.chapterCount)) * 100)) : 0;

  return (
    <li className="border-b border-line">
      <Link href={href} className="group -mx-2 flex gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-hover">
        <div className="w-[52px] shrink-0">
          <NovelCover uri={novel.coverUrl} title={novel.title} seed={novel.slug} color={novel.coverColor} sizes="52px" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-start gap-2">
            <span className="line-clamp-2 flex-1 font-serif text-[15px] leading-snug font-semibold text-fg group-hover:text-accent-fg">
              {novel.title}
            </span>
            {newCount > 0 && (
              <span
                aria-label={`${newCount} chương mới`}
                className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-on-accent">
                +{badgeLabel(newCount)}
              </span>
            )}
          </div>
          <span className="text-xs text-fg-2">
            {chapter
              ? `Chương ${chapter} / ${novel.chapterCount}${readAt ? ` · ${timeAgo(readAt)}` : ""}`
              : `Chưa đọc · ${novel.chapterCount} chương`}
          </span>
          <div className="mt-auto h-[3px] overflow-hidden rounded-full bg-line" aria-hidden>
            <div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </Link>
    </li>
  );
}
