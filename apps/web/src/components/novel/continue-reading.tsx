import Link from "next/link";

import { NovelCover } from "./novel-cover";

import { cn } from "@/lib/cn";
import { fetchChapterTitle, fetchNovelCards } from "@/lib/queries";
import { latestProgress } from "@/lib/state-ops";
import { readMyStateOrEmpty } from "@/lib/state-store";

/**
 * Thẻ "Đang đọc": truyện có tiến độ mới nhất. Chưa đọc gì (hoặc truyện đã bị xoá) → không hiện.
 */
export async function ContinueReading({ className }: { className?: string }) {
  const latest = latestProgress(await readMyStateOrEmpty());
  if (!latest) return null;

  const { slug, entry } = latest;
  const [[novel], title] = await Promise.all([fetchNovelCards([slug]), fetchChapterTitle(slug, entry.chapter)]);
  if (!novel || title === null) return null;

  const percent = Math.round(Math.min(1, entry.chapter / Math.max(1, novel.chapterCount)) * 100);

  return (
    <Link
      href={`/truyen/${slug}/chuong/${entry.chapter}`}
      className={cn(
        "group flex gap-4 rounded-card border border-line bg-surface p-4 transition-colors hover:border-line-strong",
        className
      )}>
      <div className="w-[84px] shrink-0">
        <NovelCover uri={novel.coverUrl} title={novel.title} seed={slug} color={novel.coverColor} sizes="84px" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="text-[11px] font-semibold tracking-[0.08em] text-accent-fg uppercase">Đang đọc</span>
        <span className="line-clamp-2 font-heading text-[17px] leading-snug font-semibold text-fg">{novel.title}</span>
        <span className="line-clamp-1 text-[13px] text-fg-2">
          Chương {entry.chapter} / {novel.chapterCount}
          {title && ` · ${title}`}
        </span>
        <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-line" aria-hidden>
          <div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
        </div>
        <span className="mt-auto self-start rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent group-hover:bg-accent-hover">
          Đọc tiếp
        </span>
      </div>
    </Link>
  );
}
