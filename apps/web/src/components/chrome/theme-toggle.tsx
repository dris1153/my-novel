"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/cn";

const noop = () => () => {};

/** Công tắc Sáng/Tối trên sidebar; "Tự động" chỉ chọn được ở trang Tôi. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // Theme chỉ biết được ở client; trước đó vẽ ở trạng thái sáng để khỏi lệch hydrate.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const dark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Giao diện tối"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="flex min-h-11 items-center">
      <span className={cn("flex h-6 w-11 items-center rounded-full p-0.5 transition-colors", dark ? "bg-accent" : "bg-fg-3")}>
        <span
          className={cn(
            "size-5 rounded-full bg-surface shadow-sm transition-transform motion-reduce:transition-none",
            dark && "translate-x-5"
          )}
        />
      </span>
    </button>
  );
}
