"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { ChapterNavPair } from "./chapter-nav-pair";
import { ReaderChrome } from "./reader-chrome";
import { ReaderSettingsSheet } from "./reader-settings-sheet";
import { useChromeVisibility } from "./use-chrome-visibility";
import { useProgressSync } from "./use-progress-sync";

import { READER_LINE_HEIGHTS, READER_SIZES, READER_THEMES, READER_WIDTH, useReaderPrefs } from "@/lib/reader";

type Props = {
  novelSlug: string;
  novelTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  total: number;
  prevNumber: number | null;
  nextNumber: number | null;
  nextTitle: string | null;
  /** Vị trí cuộn đã lưu của CHƯƠNG NÀY (0 nếu tiến độ đang ở chương khác). */
  initialScroll: number;
  /** Tiến độ đã trỏ tới chương này rồi, khỏi ghi lại khi mở. */
  alreadySaved: boolean;
  children: React.ReactNode;
};

export function ReaderShell({
  novelSlug,
  novelTitle,
  chapterNumber,
  chapterTitle,
  total,
  prevNumber,
  nextNumber,
  nextTitle,
  initialScroll,
  alreadySaved,
  children,
}: Props) {
  const router = useRouter();
  const prefs = useReaderPrefs();
  const theme = READER_THEMES[prefs.theme];
  const fontSize = READER_SIZES[prefs.sizeIndex] ?? READER_SIZES[2];
  const lineHeight = READER_LINE_HEIGHTS[prefs.lineHeight]?.value ?? READER_LINE_HEIGHTS.normal.value;

  const [settingsOpen, setSettingsOpen] = useState(false);
  const chrome = useChromeVisibility(chapterNumber);
  useProgressSync({ slug: novelSlug, chapter: chapterNumber, initialScroll, alreadySaved });

  const fillRef = useRef<HTMLDivElement | null>(null);
  const percentRef = useRef<HTMLSpanElement | null>(null);
  const settingsButtonRef = useRef<HTMLButtonElement | null>(null);

  const novelHref = `/truyen/${novelSlug}`;
  const prevHref = prevNumber !== null ? `${novelHref}/chuong/${prevNumber}` : null;
  const nextHref = nextNumber !== null ? `${novelHref}/chuong/${nextNumber}` : null;

  // Vạch tiến độ + % chương: ghi thẳng vào DOM để không re-render mỗi frame cuộn.
  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${percent})`;
      if (percentRef.current) percentRef.current.textContent = `${Math.round(percent * 100)}%`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [chapterNumber]);

  // Phím ←/→ chuyển chương, theo lối đọc trên máy tính.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (settingsOpen || (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;
      if (event.key === "ArrowLeft" && prevHref) router.push(prevHref);
      if (event.key === "ArrowRight" && nextHref) router.push(nextHref);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevHref, nextHref, router, settingsOpen]);

  const { pin, toggle } = chrome;
  const openSettings = useCallback(() => {
    pin(true);
    setSettingsOpen(true);
  }, [pin]);
  const closeSettings = useCallback(() => {
    setSettingsOpen(false);
    pin(false);
    // Đợi re-render gỡ `inert` khỏi thanh điều khiển rồi mới trả focus về nút "Aa".
    requestAnimationFrame(() => settingsButtonRef.current?.focus());
  }, [pin]);

  // Chạm vào thân chữ để bật/tắt thanh điều khiển — trừ khi đang bôi chọn chữ hoặc bấm link/nút.
  // Chờ một nhịp: nhấn đúp để bôi một từ không được bật/tắt thanh.
  const tapTimer = useRef<number | null>(null);
  const onArticleClick = (event: React.MouseEvent) => {
    if (tapTimer.current !== null) window.clearTimeout(tapTimer.current);
    tapTimer.current = null;
    if (event.detail > 1 || window.getSelection()?.toString()) return;
    if ((event.target as HTMLElement).closest("a, button")) return;
    tapTimer.current = window.setTimeout(toggle, 220);
  };

  // Đang focus bằng bàn phím trong thanh điều khiển thì giữ thanh hiện (không tự ẩn khi đang thao tác).
  const onBlurChrome = (event: React.FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) pin(false);
  };

  return (
    <div
      className="min-h-dvh"
      // Viền focus theo màu chữ của nền đọc: hổ phách không đủ tương phản trên nền Giấy/Ngả vàng.
      style={{ backgroundColor: theme.bg, color: theme.fg, "--focus-ring": theme.fg } as React.CSSProperties}>
      <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[2px]" style={{ backgroundColor: `${theme.dim}40` }}>
        <div ref={fillRef} className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
      </div>

      {/* Bảng cài đặt mở thì phần còn lại không nhận focus/click (giữ focus trong bảng). */}
      <div inert={settingsOpen}>
        <ReaderChrome
          visible={chrome.visible}
          theme={theme}
          novelHref={novelHref}
          novelTitle={novelTitle}
          chapterNumber={chapterNumber}
          total={total}
          prevHref={prevHref}
          nextHref={nextHref}
          percentRef={percentRef}
          settingsButtonRef={settingsButtonRef}
          onOpenSettings={openSettings}
          onFocusChrome={() => pin(true)}
          onBlurChrome={onBlurChrome}
        />

        <article
          onClick={onArticleClick}
          className="mx-auto w-full px-5 pt-20 pb-32"
          style={{ maxWidth: READER_WIDTH + 40 }}>
          <header className="text-center">
            <Link href={novelHref} className="inline-flex min-h-11 items-center px-2 font-sans text-sm" style={{ color: theme.dim }}>
              {novelTitle}
            </Link>
            {chapterTitle ? (
              <>
                <p className="font-heading text-sm font-bold tracking-[0.08em] uppercase" style={{ color: theme.dim }}>
                  Chương {chapterNumber}
                </p>
                <h1 className="mt-1 font-heading text-[26px] leading-snug font-bold">{chapterTitle}</h1>
              </>
            ) : (
              <h1 className="font-heading text-[26px] leading-snug font-bold">Chương {chapterNumber}</h1>
            )}
          </header>

          <ChapterNavPair theme={theme} prevHref={prevHref} nextHref={nextHref} />

          <div
            className="mt-7"
            style={{
              fontFamily: prefs.serif ? "var(--font-literata)" : "var(--font-nunito)",
              fontSize,
              lineHeight,
            }}>
            {children}
          </div>

          <ChapterNavPair
            theme={theme}
            prevHref={prevHref}
            nextHref={nextHref}
            end={{ chapterNumber, nextTitle, novelHref }}
          />
        </article>
      </div>

      {settingsOpen && <ReaderSettingsSheet onClose={closeSettings} />}
    </div>
  );
}
