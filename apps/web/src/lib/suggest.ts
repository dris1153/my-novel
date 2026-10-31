import type { UserState } from "shared/src/store.ts";

// Thuần (không import queries) để test được bằng `node --test`.
type Card = { slug: string; genres: string[] };

/**
 * "Gợi ý cho bạn": truyện chưa đọc/theo dõi, cùng thể loại với truyện đã đọc/theo dõi.
 * Trùng nhiều thể loại lên trước; hoà thì giữ thứ tự đầu vào (index xếp theo cập nhật mới nhất).
 */
export function suggestNovels<C extends Card>(cards: C[], state: UserState, limit = 5): C[] {
  const mine = new Set([...Object.keys(state.progress), ...state.library.map((e) => e.slug)]);
  const liked = new Set(cards.filter((c) => mine.has(c.slug)).flatMap((c) => c.genres));

  return cards
    .filter((c) => !mine.has(c.slug))
    .map((card) => ({ card, score: card.genres.filter((g) => liked.has(g)).length }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score) // Array.sort ổn định nên hoà giữ nguyên thứ tự
    .slice(0, limit)
    .map(({ card }) => card);
}
