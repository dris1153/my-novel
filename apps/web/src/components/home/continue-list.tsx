import Link from "next/link";

import { ClockBadge, HomeHeading, PlayIcon } from "./home-heading";
import { ReadingProgress } from "./reading-progress";

import { NovelCover } from "@/components/novel/novel-cover";
import { cn } from "@/lib/cn";
import type { LibraryRow } from "@/lib/library-rows";
import type { NovelCard } from "@/lib/queries";

/** "Tiếp tục đọc": các truyện đọc dở khác, ngoài truyện đã có ở thẻ "Đang đọc". */
export function ContinueList({ rows, className }: { rows: LibraryRow<NovelCard>[]; className?: string }) {
  return (
    <section className={cn("min-w-0 rounded-card bg-tint-lavender p-5 lg:p-6", className)}>
      <HomeHeading icon={<ClockBadge />} title="Tiếp tục đọc" action={{ href: "/tu-truyen?tab=dang-doc", label: "Xem tất cả →" }} />
      <ul className="mt-2 flex flex-col gap-3">
        {rows.map(({ novel, chapter }) => {
          const at = chapter ?? 1;
          return (
            <li key={novel.slug}>
              <Link href={`/truyen/${novel.slug}/chuong/${at}`} className="group flex items-center gap-4">
                <div className="w-[64px] shrink-0">
                  <NovelCover uri={novel.coverUrl} title={novel.title} seed={novel.slug} color={novel.coverColor} sizes="64px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-heading text-[17px] font-extrabold text-fg group-hover:text-accent-fg">{novel.title}</p>
                  <p className="mt-0.5 text-sm text-fg-2">
                    Chương {at} / {novel.chapterCount}
                  </p>
                  <ReadingProgress chapter={at} total={novel.chapterCount} className="mt-2" />
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-surface text-fg group-hover:bg-hover">
                  <PlayIcon />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
