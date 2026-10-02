"use client";

import { useSyncExternalStore } from "react";

/**
 * Vùng đọc giữ hệ riêng, tách khỏi palette chrome — đọc đêm là tính năng.
 * Bốn theme này bất biến (xem plan/phase-07).
 */
export const READER_THEMES = {
  paper: { label: "Giấy", bg: "#FBF8F3", fg: "#1C1917", dim: "#8B837A" },
  sepia: { label: "Ngả vàng", bg: "#F2E7D0", fg: "#3B2F1E", dim: "#8A7A5E" },
  night: { label: "Đêm", bg: "#141210", fg: "#C9C2B8", dim: "#6E665F" },
  oled: { label: "Đen tuyền", bg: "#000000", fg: "#B5AFA6", dim: "#5E5852" },
} as const;

export type ReaderThemeKey = keyof typeof READER_THEMES;

export const READER_SIZES = [15, 16.5, 18, 20, 22, 24] as const;

/** Dấu tiếng Việt chồng cao (ế, ộ, ữ) — dưới 1.75 là các dòng dính vào nhau. */
export const READER_LINE_HEIGHT = 1.8;

/** ~64ch — giới hạn độ dài dòng để mắt không phải quét quá xa. */
export const READER_WIDTH = 680;

export type ReaderPrefs = {
  sizeIndex: number;
  theme: ReaderThemeKey;
  serif: boolean;
};

const DEFAULTS: ReaderPrefs = { sizeIndex: 2, theme: "paper", serif: true };
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
