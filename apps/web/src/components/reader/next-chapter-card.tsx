import Link from "next/link";

import type { READER_THEMES } from "@/lib/reader";

type Theme = (typeof READER_THEMES)[keyof typeof READER_THEMES];

/** Cuối chương: mời đọc tiếp ngay (hành động phổ biến nhất), kèm đường về trang truyện. */
export function NextChapterCard({
  theme,
  chapterNumber,
  nextHref,
  nextNumber,
  nextTitle,
  novelHref,
}: {
  theme: Theme;
  chapterNumber: number;
  nextHref: string | null;
  nextNumber: number | null;
  nextTitle: string | null;
  novelHref: string;
}) {
  return (
    <section
      className="mt-12 flex flex-col items-center gap-4 rounded-card border px-5 py-6 text-center font-sans"
      style={{ borderColor: `${theme.dim}44` }}>
      <p className="text-xs tracking-[0.08em] uppercase" style={{ color: theme.dim }}>
        Hết chương {chapterNumber}
      </p>
      {nextHref ? (
        <Link
          href={nextHref}
          className="flex min-h-12 w-full max-w-[420px] flex-col items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-on-accent hover:brightness-105">
          <span className="text-[15px] font-semibold">Đọc chương {nextNumber}</span>
          {nextTitle && <span className="line-clamp-1 text-xs opacity-80">{nextTitle}</span>}
        </Link>
      ) : (
        <p className="text-sm" style={{ color: theme.fg }}>
          Bạn đã đọc tới chương mới nhất.
        </p>
      )}
      <Link href={novelHref} className="min-h-11 px-3 py-2 text-sm underline-offset-4 hover:underline" style={{ color: theme.dim }}>
        Về trang truyện
      </Link>
    </section>
  );
}
