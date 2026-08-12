import { parse, type HTMLElement } from 'node-html-parser';
import type { NovelStatus } from 'shared';

export type ListingMeta = {
  title: string;
  author: string;
  status: NovelStatus;
  description: string | null;
  coverUrl: string | null;
  genreSlugs: string[];
  totalPages: number;
};

export type ChapterLink = { url: string; title: string };

function textOf(el: HTMLElement | null): string {
  return el ? el.text.replace(/\s+/g, ' ').trim() : '';
}

/** "Full" / "Hoàn thành" → completed; còn lại → ongoing. */
function parseStatus(raw: string): NovelStatus {
  return /full|hoàn thành/i.test(raw) ? 'completed' : 'ongoing';
}

/** Bóc metadata từ trang truyện (trang listing đầu tiên). */
export function parseListingMeta(html: string): ListingMeta {
  const root = parse(html);

  const title = textOf(root.querySelector('h3.title'));
  const author = textOf(root.querySelector('.info [itemprop="author"]'));

  // Genre CHỈ lấy trong .info — querySelector toàn trang sẽ dính menu sidebar.
  const info = root.querySelector('.info');
  const genreSlugs = info
    ? [...new Set(
        info
          .querySelectorAll('a[href*="/the-loai/"]')
          .map((a) => a.getAttribute('href')?.match(/\/the-loai\/([a-z0-9-]+)\//)?.[1])
          .filter((s): s is string => Boolean(s))
      )]
    : [];

  // Trạng thái nằm trong .info dạng "Trạng thái:</h3><span>Full</span>".
  const statusText = info?.querySelectorAll('span').map((s) => s.text).join(' ') ?? '';
  const status = parseStatus(statusText);

  const desc = root.querySelector('[itemprop="description"]');
  const description = desc ? desc.text.replace(/\s+\n/g, '\n').trim() || null : null;

  const cover =
    root.querySelector('.book img[itemprop="image"]') ?? root.querySelector('.book img');
  const coverUrl = cover?.getAttribute('src')?.trim() || null;

  const totalPageEl = root.querySelector('#total-page');
  const totalPages = Math.max(1, Number(totalPageEl?.getAttribute('value')) || 1);

  return { title, author, status, description, coverUrl, genreSlugs, totalPages };
}

/**
 * Bóc link chương từ MỘT trang listing, theo đúng thứ tự xuất hiện (thứ tự đọc).
 * KHÔNG parse số chương từ URL: có truyện chia quyển (`/quyen-1-chuong-1/`), có
 * sub-chương (`/quyen-1-chuong-1-2/`), số reset theo quyển → parse số là đụng
 * unique(novel_id, number). Số chương do orchestrator gán theo vị trí.
 */
export function parseChapterLinks(html: string): ChapterLink[] {
  const root = parse(html);
  const out: ChapterLink[] = [];

  // Trang có thể chia nhiều khối .list-chapter (2 cột) — querySelectorAll span hết.
  for (const a of root.querySelectorAll('.list-chapter a[href]')) {
    const url = a.getAttribute('href')?.trim();
    // Chỉ lấy link chương (chứa "chuong-<số>"), bỏ link điều hướng trong khối.
    if (!url || !/chuong-\d/.test(url)) continue;
    out.push({ url, title: (a.getAttribute('title') || a.text).trim() });
  }

  return out;
}

/**
 * Bóc nội dung 1 chương. Trả text với các đoạn ngăn bằng "\n\n" (khớp reader).
 * Giữ nguyên credit dịch giả. Loại quảng cáo/script trước khi lấy text.
 */
export function parseChapterContent(html: string): string {
  const root = parse(html);
  const body = root.querySelector('#chapter-c');
  if (!body) return '';

  // Bỏ quảng cáo/script/style lồng bên trong.
  for (const junk of body.querySelectorAll('script, style, .ads, [class*="ads"], ins, iframe')) {
    junk.remove();
  }

  // <br> và ranh giới block → xuống dòng, rồi gộp thành đoạn.
  const withBreaks = body.innerHTML
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div)>/gi, '\n\n');

  const text = parse(withBreaks)
    .text.replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Gộp dòng đơn lẻ thành đoạn: mỗi dòng phi rỗng là 1 đoạn.
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n\n');
}
