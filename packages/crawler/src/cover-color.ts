// Màu bìa dùng làm nền gradient dưới chữ sáng/tối, nên kẹp độ sáng và độ bão hoà
// để gradient không bao giờ làm chữ khó đọc, kể cả với bìa trắng toát hay đen kịt.
const MIN_L = 0.25;
const MAX_L = 0.5;
const MAX_S = 0.6;
// Độ chói tương đối tối đa: giữ chữ sáng của dark theme đạt AA trên vùng đậm nhất của gradient.
const MAX_LUMINANCE = 0.08;
const LUMINANCE_FLOOR_L = 0.1;

type Rgb = { r: number; g: number; b: number };

function rgbToHsl({ r, g, b }: Rgb): [number, number, number] {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h =
    max === rn ? ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6 : max === gn ? ((bn - rn) / d + 2) / 6 : ((rn - gn) / d + 4) / 6;
  return [h, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  const f = (n: number) => {
    const k = (n + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function clampCoverColor(rgb: Rgb): string {
  const [h, s0, l0] = rgbToHsl(rgb);
  const s = Math.min(s0, MAX_S);
  let l = Math.min(MAX_L, Math.max(MIN_L, l0));
  // Vàng/xanh lá sáng hơn nhiều so với độ L của HSL — hạ tiếp (được xuống dưới MIN_L) tới khi độ chói thật đủ thấp.
  while (l > LUMINANCE_FLOOR_L && luminance(hslToHex(h, s, l)) > MAX_LUMINANCE) l -= 0.01;
  return hslToHex(h, s, l);
}
