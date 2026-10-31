"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const AUTO_HIDE_MS = 3000;
const SCROLL_DELTA = 8;
const TOP_ZONE = 80;

/**
 * Thanh điều khiển của trình đọc: hiện lúc mở chương rồi tự ẩn sau 3s, cuộn xuống thì ẩn,
 * cuộn lên (hoặc về gần đầu trang) thì hiện, chạm giữa trang để bật/tắt.
 */
export function useChromeVisibility(resetKey: unknown) {
  const [visible, setVisible] = useState(true);
  const pinned = useRef(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const timer = window.setTimeout(() => {
      if (!pinned.current) setVisible(false);
    }, AUTO_HIDE_MS);

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (y < TOP_ZONE || delta < -SCROLL_DELTA) setVisible(true);
      else if (delta > SCROLL_DELTA && !pinned.current) setVisible(false);
      if (Math.abs(delta) > SCROLL_DELTA) lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [resetKey]);

  const toggle = useCallback(() => setVisible((v) => !v), []);
  /** Giữ thanh hiện (vd khi bảng cài đặt đang mở hoặc đang focus bằng bàn phím). */
  const pin = useCallback((value: boolean) => {
    pinned.current = value;
    if (value) setVisible(true);
  }, []);

  return { visible, toggle, pin };
}
