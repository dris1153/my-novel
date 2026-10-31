"use client";

import Link from "next/link";
import type { Ref } from "react";

import { cn } from "@/lib/cn";
import type { READER_THEMES } from "@/lib/reader";

type Theme = (typeof READER_THEMES)[keyof typeof READER_THEMES];

const ICON = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const ICON_BUTTON = "grid size-11 shrink-0 place-items-center rounded-full";

/**
 * Thanh trên + dưới của trình đọc. Nằm đè lên chữ (fixed) nên bật/tắt không làm chữ nhảy;
 * chỉ trượt bằng transform. Thanh trên nền slate cố định (kiểu TruyenYY); thanh dưới theo nền đọc.
 */
export function ReaderChrome({
  visible,
  theme,
  novelHref,
  novelTitle,
  chapterNumber,
  total,
  prevHref,
  nextHref,
  percentRef,
  settingsButtonRef,
  onOpenSettings,
  onFocusChrome,
  onBlurChrome,
}: {
  visible: boolean;
  theme: Theme;
  novelHref: string;
  novelTitle: string;
  chapterNumber: number;
  total: number;
  prevHref: string | null;
  nextHref: string | null;
  percentRef: Ref<HTMLSpanElement>;
  settingsButtonRef: Ref<HTMLButtonElement>;
  onOpenSettings: () => void;
  onFocusChrome: () => void;
  onBlurChrome: (event: React.FocusEvent<HTMLElement>) => void;
}) {
  const bar = { backgroundColor: `${theme.bg}f2`, color: theme.fg, borderColor: `${theme.dim}33` };
  const slide = "transition-transform duration-200 ease-out motion-reduce:transition-none";

  return (
    <>
      <header
        onFocusCapture={onFocusChrome}
        onBlurCapture={onBlurChrome}
        className={cn(
          "fixed inset-x-0 top-[2px] z-40 border-b border-line bg-bar text-on-bar [--focus-ring:var(--on-bar)]",
          slide,
          !visible && "-translate-y-[calc(100%+2px)]"
        )}>
        <div className="mx-auto flex h-14 w-full max-w-[760px] items-center gap-1 px-1">
          <Link href={novelHref} aria-label="Về trang truyện" className={ICON_BUTTON}>
            <svg {...ICON}>
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </Link>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate font-heading text-[15px] font-bold">{novelTitle}</span>
            <span className="text-[11px] text-on-bar/80">
              Chương {chapterNumber} / {total}
            </span>
          </div>
          <Link href={`${novelHref}/muc-luc`} aria-label="Mục lục" className={ICON_BUTTON}>
            <svg {...ICON}>
              <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
            </svg>
          </Link>
          <button
            ref={settingsButtonRef}
            type="button"
            onClick={onOpenSettings}
            aria-label="Cài đặt đọc"
            className={cn(ICON_BUTTON, "font-sans text-[15px] font-semibold")}>
            Aa
          </button>
        </div>
      </header>

      <nav
        aria-label="Chuyển chương"
        onFocusCapture={onFocusChrome}
        onBlurCapture={onBlurChrome}
        className={cn("fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)]", slide, !visible && "translate-y-full")}
        style={bar}>
        <div className="mx-auto flex h-14 w-full max-w-[760px] items-center gap-2 px-2">
          <ChapterStep href={prevHref} label="Chương trước" dir="prev" />
          <span ref={percentRef} className="flex-1 text-center text-xs tabular-nums" style={{ color: theme.dim }}>
            0%
          </span>
          <ChapterStep href={nextHref} label="Chương sau" dir="next" />
        </div>
      </nav>
    </>
  );
}

function ChapterStep({ href, label, dir }: { href: string | null; label: string; dir: "prev" | "next" }) {
  const content = (
    <>
      {dir === "prev" && (
        <svg {...ICON}>
          <path d="M15 5l-7 7 7 7" />
        </svg>
      )}
      <span className="text-sm">{label}</span>
      {dir === "next" && (
        <svg {...ICON}>
          <path d="M9 5l7 7-7 7" />
        </svg>
      )}
    </>
  );
  const className = "flex min-h-11 items-center gap-1 rounded-full px-3";

  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <span aria-disabled className={cn(className, "opacity-40")}>
      {content}
    </span>
  );
}
