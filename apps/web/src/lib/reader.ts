"use client";

import { useSyncExternalStore } from "react";

import type { ReaderLineHeight, ReaderThemeKey } from "./reader-themes";

export * from "./reader-themes";

export type ReaderPrefs = {
  sizeIndex: number;
  theme: ReaderThemeKey;
  serif: boolean;
  lineHeight: ReaderLineHeight;
};

// App dark-first nên nền đọc mặc định là Đêm. Prefs đã lưu (khoá cũ) được merge, không mất.
const DEFAULTS: ReaderPrefs = { sizeIndex: 2, theme: "night", serif: true, lineHeight: "normal" };
const KEY = "web-reader-prefs-v1";

/**
 * Store nhỏ đọc/ghi localStorage qua `useSyncExternalStore` thay vì setState
 * trong effect (React Compiler chặn pattern đó, và cách này còn đồng bộ giữa
 * nhiều component).
 */
let cache: ReaderPrefs | null = null;
const listeners = new Set<() => void>();

function read(): ReaderPrefs {
  if (cache) return cache;
  if (typeof window === "undefined") {
    cache = DEFAULTS;
    return cache;
  }
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<ReaderPrefs>) } : DEFAULTS;
  } catch {
    cache = DEFAULTS;
  }
  return cache;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setReaderPrefs(patch: Partial<ReaderPrefs>) {
  cache = { ...read(), ...patch };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // Hỏng storage thì vẫn đọc được, chỉ là không nhớ giữa các lần.
  }
  listeners.forEach((listener) => listener());
}

export function useReaderPrefs(): ReaderPrefs {
  return useSyncExternalStore(subscribe, read, () => DEFAULTS);
}
