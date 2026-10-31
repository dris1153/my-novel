import type { ProgressEntry, UserState } from "shared/src/store.ts";

// Hàm thuần: trả về CHÍNH state cũ khi không có gì đổi, để caller biết bỏ qua commit.

const MAX_LIBRARY = 500;
const MAX_PROGRESS = 200;
const SCROLL_EPSILON = 0.01;

export function setSaved(state: UserState, slug: string, saved: boolean, now: string): UserState {
  const has = state.library.some((e) => e.slug === slug);
  if (saved === has) return state;
  if (!saved) return { ...state, library: state.library.filter((e) => e.slug !== slug) };
  if (state.library.length >= MAX_LIBRARY) return state;
  return { ...state, library: [{ slug, addedAt: now }, ...state.library] };
}

export function setProgress(
  state: UserState,
  patch: { slug: string; chapter: number; scroll: number },
  now: string
): UserState {
  const old = state.progress[patch.slug];
  // `now` là lúc yêu cầu tới server (chụp trước vòng retry): bản ghi cũ đến muộn do thua 409
  // không được đè lên bản mới hơn.
  if (old && old.updatedAt > now) return state;
  if (old && old.chapter === patch.chapter && Math.abs(old.scroll - patch.scroll) < SCROLL_EPSILON) {
    return state;
  }
  const entry: ProgressEntry = { chapter: patch.chapter, scroll: patch.scroll, updatedAt: now };
  return { ...state, progress: pruneProgress({ ...state.progress, [patch.slug]: entry }) };
}

/** Ghi nhận đã thấy `count` chương của truyện — gốc tính badge "+N chương mới". */
export function markSeen(state: UserState, slug: string, count: number): UserState {
  if (state.seen?.[slug] === count) return state;
  return { ...state, seen: { ...state.seen, [slug]: count } };
}

/** Giữ MAX_PROGRESS truyện mới nhất để file state không phình mãi. */
function pruneProgress(progress: Record<string, ProgressEntry>): Record<string, ProgressEntry> {
  const entries = Object.entries(progress);
  if (entries.length <= MAX_PROGRESS) return progress;
  entries.sort((a, b) => b[1].updatedAt.localeCompare(a[1].updatedAt));
  return Object.fromEntries(entries.slice(0, MAX_PROGRESS));
}

/** Truyện đọc gần nhất — cho khối "Đang đọc". */
export function latestProgress(state: UserState): { slug: string; entry: ProgressEntry } | null {
  let best: { slug: string; entry: ProgressEntry } | null = null;
  for (const [slug, entry] of Object.entries(state.progress)) {
    if (!best || entry.updatedAt > best.entry.updatedAt) best = { slug, entry };
  }
  return best;
}
