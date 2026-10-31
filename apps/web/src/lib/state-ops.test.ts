import { test } from "node:test";
import assert from "node:assert/strict";
import type { UserState } from "shared/src/store.ts";
import { markSeen, setProgress, setSaved } from "./state-ops.ts";

const empty: UserState = { library: [], progress: {} };
const T1 = "2026-01-01T00:00:00.000Z";
const T2 = "2026-01-02T00:00:00.000Z";

test("setSaved hai lần cùng giá trị = không đổi (cùng tham chiếu)", () => {
  const a = setSaved(empty, "a", true, T1);
  assert.deepEqual(a.library, [{ slug: "a", addedAt: T1 }]);
  assert.equal(setSaved(a, "a", true, T2), a);
  assert.equal(setSaved(empty, "a", false, T1), empty);
});

test("setSaved bỏ theo dõi, truyện mới lên đầu", () => {
  const s = setSaved(setSaved(empty, "a", true, T1), "b", true, T2);
  assert.deepEqual(s.library.map((e) => e.slug), ["b", "a"]);
  assert.deepEqual(setSaved(s, "b", false, T2).library.map((e) => e.slug), ["a"]);
});

test("setSaved chặn thư viện quá lớn", () => {
  let s = empty;
  for (let i = 0; i < 500; i++) s = setSaved(s, `n${i}`, true, T1);
  assert.equal(s.library.length, 500);
  assert.equal(setSaved(s, "extra", true, T1), s);
});

test("setProgress ghi chương mới; cùng chương cuộn gần như cũ thì bỏ qua", () => {
  const a = setProgress(empty, { slug: "a", chapter: 3, scroll: 0.5 }, T1);
  assert.deepEqual(a.progress.a, { chapter: 3, scroll: 0.5, updatedAt: T1 });
  assert.equal(setProgress(a, { slug: "a", chapter: 3, scroll: 0.505 }, T2), a);
  assert.equal(setProgress(a, { slug: "a", chapter: 3, scroll: 0.7 }, T2).progress.a.scroll, 0.7);
  assert.equal(setProgress(a, { slug: "a", chapter: 4, scroll: 0.5 }, T2).progress.a.chapter, 4);
});

test("setProgress không đụng truyện khác", () => {
  const a = setProgress(empty, { slug: "a", chapter: 1, scroll: 0 }, T1);
  const b = setProgress(a, { slug: "b", chapter: 2, scroll: 0.1 }, T2);
  assert.equal(b.progress.a, a.progress.a);
});

test("setProgress bỏ bản ghi cũ hơn bản đã lưu (thua cuộc đua 409)", () => {
  const newer = setProgress(empty, { slug: "a", chapter: 6, scroll: 0 }, T2);
  assert.equal(setProgress(newer, { slug: "a", chapter: 5, scroll: 0.97 }, T1), newer);
});

test("setProgress giữ tối đa 200 truyện, bỏ truyện cũ nhất", () => {
  let s = empty;
  for (let i = 0; i < 201; i++) {
    s = setProgress(s, { slug: `n${i}`, chapter: 1, scroll: 0 }, `2026-01-01T00:00:${String(i % 60).padStart(2, "0")}.${String(i).padStart(3, "0")}Z`);
  }
  assert.equal(Object.keys(s.progress).length, 200);
  assert.equal("n0" in s.progress, false);
  assert.equal("n200" in s.progress, true);
});

test("markSeen: không đổi → cùng tham chiếu; state cũ không có seen vẫn ghi được", () => {
  const a = markSeen(empty, "a", 10);
  assert.deepEqual(a.seen, { a: 10 });
  assert.equal(markSeen(a, "a", 10), a);
  assert.deepEqual(markSeen(a, "b", 3).seen, { a: 10, b: 3 });
  assert.equal(markSeen(a, "a", 12).seen?.a, 12);
});
