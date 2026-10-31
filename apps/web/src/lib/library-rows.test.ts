import { test } from "node:test";
import assert from "node:assert/strict";
import type { UserState } from "shared/src/store.ts";
import { badgeLabel, followingRows, readingRows } from "./library-rows.ts";

const cards = [
  { slug: "a", chapterCount: 120 },
  { slug: "b", chapterCount: 50 },
  { slug: "c", chapterCount: 10 },
];

const state: UserState = {
  library: [
    { slug: "c", addedAt: "2026-03-01T00:00:00.000Z" },
    { slug: "gone", addedAt: "2026-02-01T00:00:00.000Z" },
    { slug: "a", addedAt: "2026-01-01T00:00:00.000Z" },
  ],
  progress: {
    a: { chapter: 30, scroll: 0.2, updatedAt: "2026-04-01T00:00:00.000Z" },
    b: { chapter: 5, scroll: 0, updatedAt: "2026-05-01T00:00:00.000Z" },
    gone: { chapter: 1, scroll: 0, updatedAt: "2026-06-01T00:00:00.000Z" },
  },
  seen: { a: 100, c: 10 },
};

test("Đang đọc: sắp theo lần đọc mới nhất, bỏ truyện không còn trong index", () => {
  assert.deepEqual(readingRows(cards, state).map((r) => r.novel.slug), ["b", "a"]);
});

test("Theo dõi: giữ thứ tự tủ truyện, bỏ truyện đã xoá", () => {
  assert.deepEqual(followingRows(cards, state).map((r) => r.novel.slug), ["c", "a"]);
});

test("badge = số chương − seen; chưa có seen → 0; không âm", () => {
  const rows = readingRows(cards, state);
  assert.equal(rows.find((r) => r.novel.slug === "a")?.newCount, 20);
  assert.equal(rows.find((r) => r.novel.slug === "b")?.newCount, 0);
  const shrunk = readingRows([{ slug: "a", chapterCount: 90 }], state);
  assert.equal(shrunk[0].newCount, 0);
});

test("chương đang đọc và mốc đọc; truyện chỉ theo dõi thì null", () => {
  const c = followingRows(cards, state).find((r) => r.novel.slug === "c");
  assert.equal(c?.chapter, null);
  assert.equal(c?.readAt, null);
});

test("badgeLabel cap 99+", () => {
  assert.equal(badgeLabel(5), "5");
  assert.equal(badgeLabel(99), "99");
  assert.equal(badgeLabel(100), "99+");
});
