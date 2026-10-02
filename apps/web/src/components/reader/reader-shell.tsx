"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ReaderSettings } from "./reader-settings";

import {
  READER_LINE_HEIGHT,
  READER_SIZES,
  READER_THEMES,
  READER_WIDTH,
  useReaderPrefs,
} from "@/lib/reader";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/supabase/config";

type Props = {
  novelId: string;
  novelSlug: string;
  novelTitle: string;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  total: number;
  hasPrev: boolean;
  hasNext: boolean;
  children: React.ReactNode;
};

export function ReaderShell({
  novelId,
  novelSlug,
  novelTitle,
  chapterId,
  chapterNumber,
  chapterTitle,
  total,
  hasPrev,
  hasNext,
  children,
}: Props) {
  const router = useRouter();
  const prefs = useReaderPrefs();
  const theme = READER_THEMES[prefs.theme];
  const fontSize = READER_SIZES[prefs.sizeIndex] ?? READER_SIZES[2];

  const [settingsOpen, setSettingsOpen] = useState(false);

  const topbarRef = useRef<HTMLElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const userIdRef = useRef<string | null>(null);
  const lastSavedRef = useRef(0);

  const base = `/truyen/${novelSlug}`;
  const prevHref = `${base}/chuong/${chapterNumber - 1}`;
  const nextHref = `${base}/chuong/${chapterNumber + 1}`;

  // Biết có đăng nhập không, để khỏi ghi tiến độ cho khách.
  useEffect(() => {
    if (!hasSupabaseConfig) return;
    let active = true;
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (active) userIdRef.current = data.user?.id ?? null;
      });
    return () => {
      active = false;
    };
  }, []);

  // Mở lại đúng chỗ đã dừng, nếu tiến độ đã lưu thuộc chính chương này.
  useEffect(() => {
    if (!hasSupabaseConfig) return;
    let active = true;

    createClient()
      .from("reading_progress")
      .select("percent, chapters(number)")
      .eq("novel_id", novelId)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        const row = data as { percent: number; chapters: { number: number } | null } | null;
        if (!row?.chapters || row.chapters.number !== chapterNumber) return;
        const percent = Math.min(1, Math.max(0, row.percent));
        if (percent <= 0.01) return;
        requestAnimationFrame(() => {
          const scrollable = document.documentElement.scrollHeight - window.innerHeight;
          if (scrollable > 0) window.scrollTo({ top: scrollable * percent });
        });
      });

    return () => {
      active = false;
    };
  }, [novelId, chapterNumber]);

  // Cuộn: cập nhật thanh tiến độ + ẩn/hiện topbar + lưu tiến độ (throttle 5s).
  // Ghi thẳng vào DOM để không re-render mỗi frame.
  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const percent = scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0;

      if (fillRef.current) fillRef.current.style.transform = `scaleX(${percent})`;

      if (topbarRef.current) {
        const hide = y > lastY && y > 160;
        topbarRef.current.style.transform = hide ? "translateY(-100%)" : "translateY(0)";
      }
      lastY = y;

      const now = Date.now();
      if (
        userIdRef.current &&
        now - lastSavedRef.current > 5000 &&
        percent > 0.01
      ) {
        lastSavedRef.current = now;
        createClient()
          .from("reading_progress")
          .upsert(
            {
              user_id: userIdRef.current,
              novel_id: novelId,
              chapter_id: chapterId,
              percent,
            },
            { onConflict: "user_id,novel_id" }
          )
          .then(() => {});
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [novelId, chapterId]);

  // Điều hướng bằng bàn phím, theo lối đọc trên desktop.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (event.key === "ArrowLeft" && hasPrev) router.push(prevHref);
      if (event.key === "ArrowRight" && hasNext) router.push(nextHref);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasPrev, hasNext, prevHref, nextHref, router]);

  return (
    <div className="min-h-dvh" style={{ backgroundColor: theme.bg, color: theme.fg }}>
      {/* Thanh tiến độ đọc */}
      <div className="fixed top-0 left-0 z-50 h-[3px] w-full" style={{ backgroundColor: theme.dim, opacity: 0.25 }}>
        <div
          ref={fillRef}
          className="h-full origin-left"
          style={{ backgroundColor: theme.fg, transform: "scaleX(0)" }}
        />
      </div>

      <header
        ref={topbarRef}
        className="sticky top-0 z-40 border-b transition-transform duration-200"
        style={{ backgroundColor: theme.bg, borderColor: theme.dim, color: theme.dim }}>
        <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center gap-4 px-5">
          <Link href={base} className="min-w-0 truncate text-sm hover:underline">
            ‹ {novelTitle}
          </Link>

          <span className="ml-auto shrink-0 text-xs">
            Chương {chapterNumber}/{total}
          </span>

          <Link href={`${base}/muc-luc`} className="shrink-0 text-sm hover:underline">
            Mục lục
          </Link>

          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Tuỳ chỉnh đọc"
            className="shrink-0 rounded-lg border px-2.5 py-1 text-sm"
            style={{ borderColor: theme.dim }}>
            Aa
          </button>
        </div>
      </header>

      <article className="mx-auto w-full px-5 pt-10 pb-4" style={{ maxWidth: READER_WIDTH + 40 }}>
        <p className="text-[11px] tracking-[0.08em] uppercase" style={{ color: theme.dim }}>
          Chương {chapterNumber} / {total}
        </p>
        <h1
          className="mt-2 mb-7 text-[26px] leading-[1.25]"
          style={{ fontFamily: "var(--font-literata)", fontWeight: 600 }}>
          {chapterTitle}
        </h1>

        <div
          style={{
            fontFamily: prefs.serif ? "var(--font-literata)" : "var(--font-inter)",
            fontSize,
            lineHeight: READER_LINE_HEIGHT,
          }}>
          {children}
        </div>
      </article>

      <nav
        className="mx-auto flex w-full gap-3 px-5 pt-8 pb-20"
        style={{ maxWidth: READER_WIDTH + 40 }}>
        {hasPrev ? (
          <ReaderNavLink href={prevHref} theme={theme}>
            ‹ Chương {chapterNumber - 1}
          </ReaderNavLink>
        ) : (
          <span className="flex-1" />
        )}
        {hasNext ? (
          <ReaderNavLink href={nextHref} theme={theme}>
            Chương {chapterNumber + 1} ›
          </ReaderNavLink>
        ) : (
          <span className="flex-1" />
        )}
      </nav>

      <ReaderSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

function ReaderNavLink({
  href,
  theme,
  children,
}: {
  href: string;
  theme: (typeof READER_THEMES)[keyof typeof READER_THEMES];
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex-1 rounded-lg border px-4 py-3 text-center text-sm transition-colors"
      style={{ borderColor: theme.dim, color: theme.fg }}>
      {children}
    </Link>
  );
}
