"use client";

import { useEffect } from "react";

const SAVE_EVERY_MS = 30_000;
// Lướt qua chương (giữ phím →) không được sinh mỗi chương một commit.
const OPEN_DWELL_MS = 5_000;
const MIN_DELTA = 0.01;

function scrollPercent(): number {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  return scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
}

/**
 * Khôi phục vị trí đọc và lưu tiến độ. Mỗi lần lưu là 1 commit trên GitHub nên chỉ lưu khi:
 * đã ở lại chương mới vài giây, mỗi 30 giây nếu có cuộn, và khi ẩn tab/rời trang.
 * Cố tình KHÔNG lưu lúc unmount: chuyển chương sẽ gửi "chương cũ" tới sau "chương mới".
 */
export function useProgressSync({
  slug,
  chapter,
  initialScroll,
  alreadySaved,
}: {
  slug: string;
  chapter: number;
  initialScroll: number;
  alreadySaved: boolean;
}) {
  useEffect(() => {
    let current = initialScroll;
    let sent = alreadySaved ? initialScroll : -1;
    let inflight = false;

    if (initialScroll > MIN_DELTA) {
      requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollable > 0) window.scrollTo({ top: scrollable * initialScroll });
      });
    }

    // `sent` chỉ cập nhật khi server xác nhận, để lần gửi lỗi (rate limit, mạng) được thử lại.
    // `force`: lúc ẩn tab/rời trang là cơ hội cuối nên bỏ qua cờ inflight.
    const send = (force = false) => {
      if (!force && inflight) return;
      if (sent >= 0 && Math.abs(current - sent) < MIN_DELTA) return;
      const value = current;
      inflight = true;
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, chapter, scroll: value }),
        keepalive: true,
      })
        .then((res) => {
          if (res.ok) sent = value;
        })
        .catch(() => {})
        .finally(() => {
          inflight = false;
        });
    };

    const onScroll = () => {
      current = scrollPercent();
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") send(true);
    };
    const onPageHide = () => send(true);

    const openTimer = alreadySaved ? undefined : setTimeout(send, OPEN_DWELL_MS);
    const interval = setInterval(send, SAVE_EVERY_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onHide);

    return () => {
      clearTimeout(openTimer);
      clearInterval(interval);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [slug, chapter, initialScroll, alreadySaved]);
}
