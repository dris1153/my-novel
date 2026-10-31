import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { contrastRatio as ratio } from "./contrast.ts";

// Đọc token thẳng từ globals.css để không có bản sao nào lệch khỏi CSS thật.
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function tokens(selector: RegExp): Record<string, string> {
  const block = css.match(selector)?.[1];
  assert.ok(block, `không tìm thấy khối token ${selector}`);
  return Object.fromEntries([...block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]));
}

const THEMES = {
  light: tokens(/:root\s*\{([^}]*)\}/),
  dark: tokens(/html\.dark\s*\{([^}]*)\}/),
};

const TEXT = ["fg", "fg-2", "fg-3", "accent-fg", "hot-fg"];
const BACKGROUNDS = ["canvas", "subtle", "surface", "raised", "hover", "accent-soft", "tint-lavender", "tint-peach", "tint-sky"];

for (const [name, t] of Object.entries(THEMES)) {
  test(`${name}: mọi token chữ đạt 4.5:1 trên mọi nền`, () => {
    for (const fg of TEXT) {
      for (const bg of BACKGROUNDS) {
        const r = ratio(t[fg], t[bg]);
        assert.ok(r >= 4.5, `${fg} ${t[fg]} trên ${bg} ${t[bg]} = ${r.toFixed(2)}`);
      }
    }
  });

  test(`${name}: chữ trên nút nhấn, nền nhấn nhạt và thanh slate đạt 4.5:1`, () => {
    for (const [fg, bg] of [["on-accent", "accent"], ["on-accent", "accent-hover"], ["on-bar", "bar"], ["on-ink", "ink"]]) {
      const r = ratio(t[fg], t[bg]);
      assert.ok(r >= 4.5, `${fg} trên ${bg} = ${r.toFixed(2)}`);
    }
  });
}
