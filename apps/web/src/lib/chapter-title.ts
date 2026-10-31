// Tiêu đề chương từ nguồn hay lặp cả tên truyện + "Chương N": "Đại Phụng - Chương 1: Tai ương".
// Giao diện đã tự in "Chương N" nên chỉ giữ phần tên riêng của chương.
export function cleanChapterTitle(raw: string, n: number): string {
  const marker = new RegExp(`^.*?ch(?:ương|uong)\\s*${n}(?!\\d)\\s*[:.\\-–—]?\\s*`, "iu");
  return raw.replace(marker, "").trim();
}

/** "Chương 12 · Đêm trăng", hoặc chỉ "Chương 12" khi chương không có tên riêng. */
export function chapterLabel(n: number, title: string): string {
  return title ? `Chương ${n} · ${title}` : `Chương ${n}`;
}
