import { test } from "node:test";
import assert from "node:assert/strict";

import { suggestNovels } from "./suggest.ts";

const card = (slug: string, ...genres: string[]) => ({ slug, genres });
const progress = (...slugs: string[]) =>
  Object.fromEntries(slugs.map((slug) => [slug, { chapter: 1, scroll: 0, updatedAt: "2026-10-31T00:00:00Z" }]));
const state = (reading: string[], following: string[] = []) => ({
  library: following.map((slug) => ({ slug, addedAt: "2026-10-31T00:00:00Z" })),
  progress: progress(...reading),
});

const slugs = (cards: { slug: string }[]) => cards.map((c) => c.slug);

test("bỏ truyện đã đọc/theo dõi, chỉ giữ truyện cùng thể loại", () => {
  const cards = [card("a", "kiem"), card("b", "kiem"), card("c", "tien"), card("d", "do-thi")];
  assert.deepEqual(slugs(suggestNovels(cards, state(["a"], ["c"]))), ["b"]);
});

test("xếp theo số thể loại trùng; hoà thì giữ thứ tự đầu vào (mới cập nhật trước)", () => {
  const cards = [card("doc", "kiem", "tien"), card("mot-1", "kiem"), card("hai", "tien", "kiem"), card("mot-2", "tien")];
  assert.deepEqual(slugs(suggestNovels(cards, state(["doc"]))), ["hai", "mot-1", "mot-2"]);
});

test("giới hạn số lượng; chưa đọc gì hoặc không có truyện cùng thể loại thì rỗng", () => {
  const many = [card("doc", "kiem"), ...["a", "b", "c"].map((s) => card(s, "kiem"))];
  assert.deepEqual(slugs(suggestNovels(many, state(["doc"]), 2)), ["a", "b"]);
  assert.deepEqual(suggestNovels(many, state([])), []);
  assert.deepEqual(suggestNovels([card("doc", "kiem"), card("x", "tien")], state(["doc"])), []);
});

test("slug trong state không còn trong index thì bỏ qua", () => {
  assert.deepEqual(slugs(suggestNovels([card("a", "kiem")], state(["da-xoa"], ["a"]))), []);
});
