import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clampCoverColor } from './cover-color.ts';

function lightness(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
}

test('màu tối vừa phải giữ nguyên', () => {
  assert.equal(clampCoverColor({ r: 40, g: 60, b: 90 }), '#283c5a');
});

test('bìa trắng / đen bị kẹp độ sáng (≤0.5, không tối hơn 0.1)', () => {
  for (const rgb of [{ r: 255, g: 255, b: 255 }, { r: 0, g: 0, b: 0 }, { r: 250, g: 240, b: 120 }, { r: 10, g: 5, b: 40 }]) {
    const l = lightness(clampCoverColor(rgb));
    assert.ok(l >= 0.09 && l <= 0.51, `${JSON.stringify(rgb)} → L=${l}`);
  }
});

test('đầu ra luôn là hex 6 ký tự', () => {
  assert.match(clampCoverColor({ r: 200, g: 30, b: 30 }), /^#[0-9a-f]{6}$/);
});

test('vàng/xanh lá sáng vẫn bị hạ độ chói (L của HSL không đủ)', () => {
  for (const rgb of [{ r: 255, g: 255, b: 0 }, { r: 0, g: 255, b: 0 }, { r: 0, g: 255, b: 255 }]) {
    const hex = clampCoverColor(rgb);
    const [r, g, b] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    assert.ok(0.2126 * r + 0.7152 * g + 0.0722 * b <= 0.081, `${hex}`);
  }
});
