import { test } from "node:test";
import assert from "node:assert/strict";

import { formatDay } from "./format-date.ts";

test("formatDay: theo giờ Việt Nam, ngăn bằng '/'", () => {
  // 18:30 UTC ngày 31/10 đã là 01:30 ngày 1/11 ở Việt Nam.
  assert.equal(formatDay("2026-10-31T18:30:00Z"), "01/11");
  assert.equal(formatDay("2026-10-31T03:00:00Z"), "31/10");
  assert.equal(formatDay("không phải ngày"), "");
});
