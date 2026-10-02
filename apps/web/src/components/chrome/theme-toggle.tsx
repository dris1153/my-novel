"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

// Server render `false`, client render `true` — cách nhận biết đã mount mà không
// setState trong effect (React Compiler chặn pattern đó).
const emptySubscribe = () => () => {};

/** Nút đổi sáng/tối. Chờ mount để tránh lệch hydration với giá trị của server. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Chuyển sang nền sáng" : "Chuyển sang nền tối"}
      title={isDark ? "Nền sáng" : "Nền tối"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="grid size-9 place-items-center rounded-lg border border-ash text-ink-2 hover:border-ink hover:text-ink">
      <span aria-hidden className="text-[15px] leading-none">
        {isDark ? "☀" : "☾"}
      </span>
    </button>
  );
}
