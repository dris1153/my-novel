"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/cn";

const OPTIONS = [
  { value: "system", label: "Tự động" },
  { value: "light", label: "Sáng" },
  { value: "dark", label: "Tối" },
] as const;

const noop = () => () => {};

export function ThemePicker() {
  const { theme, setTheme } = useTheme();
  // Theme chỉ biết được ở client; trước đó không đánh dấu nút nào để khỏi lệch hydrate.
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  return (
    <div role="group" aria-label="Giao diện" className="grid grid-cols-3 gap-1 rounded-xl bg-surface p-1">
      {OPTIONS.map(({ value, label }) => {
        const selected = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={selected}
            onClick={() => setTheme(value)}
            className={cn(
              "min-h-11 rounded-lg text-sm transition-colors",
              selected ? "bg-raised font-semibold text-fg shadow-sm" : "text-fg-2 hover:text-fg"
            )}>
            {label}
          </button>
        );
      })}
    </div>
  );
}
