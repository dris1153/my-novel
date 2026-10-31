import { test } from "node:test";
import assert from "node:assert/strict";

import { contrastRatio } from "./contrast.ts";
import { READER_LINE_HEIGHTS, READER_THEMES } from "./reader-themes.ts";

test("mọi nền đọc: thân truyện ≥7:1 (AAA), chữ phụ ≥4.5:1", () => {
  for (const [key, t] of Object.entries(READER_THEMES)) {
    const body = contrastRatio(t.fg, t.bg);
    const dim = contrastRatio(t.dim, t.bg);
    assert.ok(body >= 7, `${key} fg = ${body.toFixed(2)}`);
    assert.ok(dim >= 4.5, `${key} dim = ${dim.toFixed(2)}`);
  }
});

test("giãn dòng không xuống dưới 1.6 (dấu tiếng Việt chồng)", () => {
  for (const { value } of Object.values(READER_LINE_HEIGHTS)) assert.ok(value >= 1.6);
});
