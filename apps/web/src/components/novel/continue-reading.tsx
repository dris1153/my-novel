import Link from "next/link";

import { NovelCover } from "./novel-cover";

import { fetchChapterTitle, fetchNovelCards } from "@/lib/queries";
import { latestProgress } from "@/lib/state-ops";
import { readMyStateOrEmpty } from "@/lib/state-store";

/** Khối "Đang đọc": truyện có tiến độ mới nhất. Không có (hoặc truyện đã bị xoá) thì ẩn. */
export async function ContinueReading() {
  const latest = latestProgress(await readMyStateOrEmpty());
  if (!latest) return null;

  const { slug, entry } = latest;
  const [[novel], title] = await Promise.all([fetchNovelCards([slug]), fetchChapterTitle(slug, entry.chapter)]);
  if (!novel || title === null) return null;

  const percent = Math.round(Math.min(1, Math.max(0, entry.scroll)) * 100);

  return (
    <Link
      href={`/truyen/${slug}/chuong/${entry.chapter}`}
      className="flex items-center gap-4 rounded-lg bg-sepia-soft p-4 transition-[filter] hover:brightness-[0.98]">
      <div className="w-12 shrink-0">
        <NovelCover uri={novel.coverUrl} title={novel.title} seed={slug} sizes="48px" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] tracking-[0.08em] text-sepia-text uppercase">Đang đọc</p>
        <p className="truncate font-serif text-[17px] text-ink">{novel.title}</p>
        <p className="truncate text-xs text-ink-2">
          Chương {entry.chapter} — {title}
        </p>
        <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-sepia" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </Link>
  );
}
