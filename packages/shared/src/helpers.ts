// Hàm thuần, không import gì — chạy trực tiếp được bằng `node --test`.

/**
 * Slug tiếng Việt. `đ` không phải là `d` + dấu tổ hợp nên NFD không tách được,
 * phải thay tay trước khi normalize.
 */
export function slugify(input: string): string {
  return input
    .replace(/[đĐ]/g, (c) => (c === 'đ' ? 'd' : 'D'))
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function countWords(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

/** 200 wpm — tốc độ đọc tiếng Việt trung bình trên màn hình. */
export function readingMinutes(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 200));
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.0', '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace('.0', '')}K`;
  return String(n);
}

export function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'vừa xong';
  if (s < 3600) return `${Math.floor(s / 60)} phút trước`;
  if (s < 86400) return `${Math.floor(s / 3600)} giờ trước`;
  if (s < 2592000) return `${Math.floor(s / 86400)} ngày trước`;
  return new Date(iso).toLocaleDateString('vi-VN');
}

export const NOVEL_STATUS_LABEL = {
  ongoing: 'Đang ra',
  completed: 'Hoàn thành',
  hiatus: 'Tạm ngưng',
} as const;

/**
 * Tách file .txt thành các chương. Khớp "Chương 12", "Chuong 12:", "CHƯƠNG 12 - Tên".
 * Trả về theo đúng thứ tự xuất hiện; caller tự kiểm tra số chương trùng/thiếu.
 */
export function splitChapters(raw: string): { number: number; title: string; content: string }[] {
  const re = /^[ \t]*ch(?:ương|uong)[ \t]+(\d+)[ \t]*[:.\-–—]?[ \t]*(.*)$/gim;
  const marks: { index: number; length: number; number: number; title: string }[] = [];

  for (const m of raw.matchAll(re)) {
    marks.push({
      index: m.index,
      length: m[0].length,
      number: Number(m[1]),
      title: m[2].trim(),
    });
  }

  return marks.map((mark, i) => {
    const end = i + 1 < marks.length ? marks[i + 1].index : raw.length;
    return {
      number: mark.number,
      title: mark.title || `Chương ${mark.number}`,
      content: raw.slice(mark.index + mark.length, end).trim(),
    };
  });
}
