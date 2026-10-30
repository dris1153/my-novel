import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Đọc matcher từ chính proxy.ts: Next chỉ nhận matcher là literal, không import được hằng số.
// Từng có lần mất dấu `\` trong regex làm slug kết thúc bằng "png" lọt qua gate.
const source = readFileSync(new URL("../proxy.ts", import.meta.url), "utf8");
const raw = source.match(/matcher:\s*\["((?:[^"\\]|\\.)*)"\]/)?.[1];
assert.ok(raw, "không tìm thấy matcher trong proxy.ts");
const matcher = JSON.parse(`"${raw}"`) as string;

const gated = (path: string) => new RegExp(`^${matcher}$`).test(path);

test("trang, API, ảnh bìa và _next/image đều bị gate", () => {
  for (const p of ["/", "/truyen/abc", "/api/cover/abc", "/_next/image", "/the-loai/xwebp"]) {
    assert.equal(gated(p), true, p);
  }
});

test("slug kết thúc bằng đuôi ảnh không lọt gate", () => {
  for (const p of ["/truyen/abc-png", "/truyen/abcpng", "/api/cover/abcpng", "/the-loai/xwebp", "/truyen/a.svg", "/x.jpeg"]) {
    assert.equal(gated(p), true, p);
  }
});

test("chỉ file tĩnh build ra và favicon được miễn", () => {
  assert.equal(gated("/_next/static/chunks/a.js"), false);
  assert.equal(gated("/favicon.ico"), false);
  assert.equal(gated("/favicon-ico"), true);
});
