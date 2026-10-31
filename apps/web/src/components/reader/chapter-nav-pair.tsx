import Link from "next/link";

import { cn } from "@/lib/cn";
import type { READER_THEMES } from "@/lib/reader";

type Theme = (typeof READER_THEMES)[keyof typeof READER_THEMES];

const STEP = "flex min-h-12 items-center justify-center rounded-control px-4 text-[15px] font-semibold";

/**
 * Cặp nút "‹ Trước" (viền theo nền đọc) / "Tiếp ›" (xanh) kiểu TruyenYY, đặt dưới tiêu đề và cuối chương.
 * `end` thêm dòng "Hết chương N", tên chương sau và lối về trang truyện khi đã hết.
 */
export function ChapterNavPair({
  theme,
  prevHref,
  nextHref,
  end,
}: {
  theme: Theme;
  prevHref: string | null;
  nextHref: string | null;
  end?: { chapterNumber: number; nextTitle: string | null; novelHref: string };
}) {
  const outline = { borderColor: `${theme.dim}66`, color: theme.fg };

  return (
    <nav aria-label={end ? "Chuyển chương (cuối bài)" : "Chuyển chương (đầu bài)"} className={cn("font-sans", end ? "mt-12" : "mt-6")}>
      {end && (
        <p className="mb-3 text-center text-xs tracking-[0.08em] uppercase" style={{ color: theme.dim }}>
          Hết chương {end.chapterNumber}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {prevHref ? (
          <Link href={prevHref} className={cn(STEP, "border")} style={outline}>
            ‹ Trước
          </Link>
        ) : (
          <span className={cn(STEP, "border opacity-40")} style={outline}>
            ‹ Trước
          </span>
        )}
        {nextHref ? (
          <Link href={nextHref} className={cn(STEP, "bg-accent text-on-accent hover:bg-accent-hover")}>
            Tiếp ›
          </Link>
        ) : (
          <span className={cn(STEP, "border opacity-40")} style={outline}>
            Tiếp ›
          </span>
        )}
      </div>

      {end &&
        (nextHref ? (
          end.nextTitle && (
            <p className="mt-2 line-clamp-1 text-center text-xs" style={{ color: theme.dim }}>
              Tiếp theo: {end.nextTitle}
            </p>
          )
        ) : (
          <div className="mt-4 flex flex-col items-center text-sm">
            <p style={{ color: theme.fg }}>Bạn đã đọc tới chương mới nhất.</p>
            <Link
              href={end.novelHref}
              className="inline-flex min-h-11 items-center px-3 underline-offset-4 hover:underline"
              style={{ color: theme.dim }}>
              Về trang truyện
            </Link>
          </div>
        ))}
    </nav>
  );
}
