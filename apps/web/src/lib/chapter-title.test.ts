import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanChapterTitle } from "./chapter-title.ts";

test("bỏ tên truyện + 'Chương N:' ở đầu", () => {
  assert.equal(cleanChapterTitle("Đại Phụng Đả Canh Nhân - Chương 1: Tai ương ngục tù (1)", 1), "Tai ương ngục tù (1)");
  assert.equal(cleanChapterTitle("Chương 12 - Đêm trăng", 12), "Đêm trăng");
  assert.equal(cleanChapterTitle("CHƯƠNG 3. Gặp lại", 3), "Gặp lại");
});

test("không có tên riêng → chuỗi rỗng; không đụng tiêu đề không có 'Chương N'", () => {
  assert.equal(cleanChapterTitle("Chương 7", 7), "");
  assert.equal(cleanChapterTitle("Hồi kết", 2085), "Hồi kết");
});

test("không nuốt nhầm số chương dài hơn (Chương 1 ≠ Chương 12)", () => {
  assert.equal(cleanChapterTitle("Chương 12: Mười hai", 1), "Chương 12: Mười hai");
});

test("số trên nhãn nguồn lệch vị trí: vẫn bỏ tiền tố '<tên truyện> - Chương M:'", () => {
  assert.equal(cleanChapterTitle("Đại Phụng Đả Canh Nhân - Chương 414: Xin bệ hạ ban cho cái chết (2)", 402), "Xin bệ hạ ban cho cái chết (2)");
  assert.equal(
    cleanChapterTitle("Đại Phụng Đả Canh Nhân - Chương 416: Hằng Viễn: Số 3, thật ra ta đã biết (1)", 404),
    "Hằng Viễn: Số 3, thật ra ta đã biết (1)"
  );
});
