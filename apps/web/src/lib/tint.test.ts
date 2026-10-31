import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { contrastRatio } from "./contrast.ts";

// Kết quả của clampCoverColor (packages/crawler) với các màu bìa cực trị: vàng, xanh ngọc,
// xám, đen, đỏ, xanh dương, xanh lá, cam, xanh đậm. Đổi thuật toán kẹp thì cập nhật danh sách này.
const EXTREME_TINTS = ["#525214", "#155656", "#4f4f4f", "#404040", "#932525", "#3333cc", "#165a16", "#6e451c", "#335274"];

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function block(selector: RegExp): string {
  const found = css.match(selector)?.[1];
  assert.ok(found, `không tìm thấy ${selector}`);
  return found;
}

function hexVar(src: string, name: string): string {
  const v = src.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1];
  assert.ok(v, `thiếu --${name}`);
  return v;
}

function percentVar(src: string, name: string): number {
  const v = src.match(new RegExp(`--${name}:\\s*(\\d+)%`))?.[1];
  assert.ok(v, `thiếu --${name}`);
  return Number(v) / 100;
}

/** Trộn màu bìa với alpha lên nền, như color-mix(in srgb, tint a%, transparent) đặt trên nền đặc. */
function composite(tint: string, bg: string, alpha: number): string {
  const ch = (h: string, i: number) => parseInt(h.slice(i, i + 2), 16);
  return `#${[1, 3, 5]
    .map((i) => Math.round(ch(tint, i) * alpha + ch(bg, i) * (1 - alpha)).toString(16).padStart(2, "0"))
    .join("")}`;
}

for (const [name, selector] of [["light", /:root\s*\{([^}]*)\}/], ["dark", /html\.dark\s*\{([^}]*)\}/]] as const) {
  test(`${name}: chữ trên thẻ "Đang đọc" vẫn đạt 4.5:1 ở chỗ màu bìa đậm nhất`, () => {
    const t = block(selector);
    const bg = hexVar(t, "subtle");
    const alpha = percentVar(t, "tint-card");
    for (const tint of EXTREME_TINTS) {
      const under = composite(tint, bg, alpha);
      for (const text of ["fg", "fg-2", "accent-fg"]) {
        const r = contrastRatio(hexVar(t, text), under);
        assert.ok(r >= 4.5, `${text} trên ${under} (bìa ${tint}) = ${r.toFixed(2)}`);
      }
    }
  });
}
