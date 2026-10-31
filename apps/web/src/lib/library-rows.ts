import type { UserState } from "shared/src/store.ts";

// Thuần (không import queries) để test được bằng `node --test`.
type Card = { slug: string; chapterCount: number };

export type LibraryRow<C extends Card> = {
  novel: C;
  /** Chương đang đọc; null = mới theo dõi, chưa đọc. */
  chapter: number | null;
  readAt: string | null;
  /** Số chương ra thêm từ lần đọc/theo dõi gần nhất. */
  newCount: number;
};

function row<C extends Card>(novel: C, state: UserState): LibraryRow<C> {
  const progress = state.progress[novel.slug];
  const seen = state.seen?.[novel.slug];
  return {
    novel,
    chapter: progress?.chapter ?? null,
    readAt: progress?.updatedAt ?? null,
    newCount: seen === undefined ? 0 : Math.max(0, novel.chapterCount - seen),
  };
}

/** "Đang đọc": truyện có tiến độ, mới đọc nhất lên đầu. Truyện đã bị xoá khỏi index thì bỏ. */
export function readingRows<C extends Card>(cards: C[], state: UserState): LibraryRow<C>[] {
  const bySlug = new Map(cards.map((c) => [c.slug, c]));
  return Object.entries(state.progress)
    .sort((a, b) => b[1].updatedAt.localeCompare(a[1].updatedAt))
    .flatMap(([slug]) => {
      const novel = bySlug.get(slug);
      return novel ? [row(novel, state)] : [];
    });
}

/** "Theo dõi": giữ thứ tự tủ truyện (mới theo dõi trước). */
export function followingRows<C extends Card>(cards: C[], state: UserState): LibraryRow<C>[] {
  const bySlug = new Map(cards.map((c) => [c.slug, c]));
  return state.library.flatMap(({ slug }) => {
    const novel = bySlug.get(slug);
    return novel ? [row(novel, state)] : [];
  });
}

export function badgeLabel(count: number): string {
  return count > 99 ? "99+" : String(count);
}
