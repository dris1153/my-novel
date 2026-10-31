import { fetchCompleted, fetchRecent, type NovelCard } from "./queries";

type List = { title: string; load: (limit: number, offset: number) => Promise<NovelCard[]> };

/** Đích của "Thêm →", lối tắt và nav desktop: `/danh-sach/<kind>`. */
const LISTS: Record<string, List> = {
  "moi-cap-nhat": { title: "Truyện mới cập nhật", load: fetchRecent },
  "hoan-thanh": { title: "Truyện hoàn thành", load: fetchCompleted },
};

// `Object.hasOwn` để "constructor", "__proto__"… không lọt thành danh sách hợp lệ.
export function listFor(kind: string): List | null {
  return Object.hasOwn(LISTS, kind) ? LISTS[kind] : null;
}
