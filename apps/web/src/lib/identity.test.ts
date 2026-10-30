import { test } from "node:test";
import assert from "node:assert/strict";
import { isAllowedEmail, userIdFromEmail } from "./identity.ts";

test("isAllowedEmail so khớp không phân biệt hoa/thường và khoảng trắng", () => {
  const list = " A@x.com , b@y.com ";
  assert.equal(isAllowedEmail("a@x.com", list), true);
  assert.equal(isAllowedEmail("B@Y.COM", list), true);
  assert.equal(isAllowedEmail("c@x.com", list), false);
});

test("isAllowedEmail fail-closed khi thiếu email hoặc danh sách rỗng", () => {
  assert.equal(isAllowedEmail(undefined, "a@x.com"), false);
  assert.equal(isAllowedEmail("a@x.com", ""), false);
  assert.equal(isAllowedEmail("a@x.com", undefined), false);
  assert.equal(isAllowedEmail("a@x.com", " , ,"), false);
  assert.equal(isAllowedEmail("", ","), false);
});

test("không khớp một phần (a@x.com ≠ aa@x.com, a@x.co)", () => {
  assert.equal(isAllowedEmail("aa@x.com", "a@x.com"), false);
  assert.equal(isAllowedEmail("a@x.co", "a@x.com"), false);
});

test("userIdFromEmail ổn định, hex 32 ký tự, không phân biệt hoa/thường", () => {
  const id = userIdFromEmail("A@x.com");
  assert.match(id, /^[0-9a-f]{32}$/);
  assert.equal(id, userIdFromEmail(" a@X.com "));
  assert.notEqual(id, userIdFromEmail("b@x.com"));
});
