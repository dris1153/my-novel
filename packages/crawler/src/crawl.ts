import { slugify } from 'shared';

import { ChallengeError, fetchHtml, sleep } from './fetch.ts';
import { parseChapterContent, parseChapterLinks, parseListingMeta, type ChapterLink } from './parse.ts';
import {
  existingChapterNumbers,
  mapGenres,
  upsertChapter,
  upsertNovel,
  uploadCover,
} from './writer.ts';

const THROTTLE_MS = 1000; // delay giữa mỗi request chương, né rate-limit
const MAX_CONSECUTIVE_ERRORS = 5;

export type CrawlOptions = { limit?: number };

export async function crawl(listingUrl: string, opts: CrawlOptions = {}): Promise<void> {
  const base = listingUrl.replace(/\/$/, '');

  console.log(`Đọc trang truyện: ${base}`);
  const meta = parseListingMeta(await fetchHtml(listingUrl));
  console.log(`  "${meta.title}" — ${meta.author} — ${meta.status} — ${meta.totalPages} trang chương`);

  const slug = slugify(meta.title);
  const coverUrl = await uploadCover(meta.coverUrl, slug);
  const novelId = await upsertNovel(meta, coverUrl);
  await mapGenres(novelId, meta.genreSlugs);
  console.log(`  novel id=${novelId} (nháp)`);

  // Gom link chương qua các trang /trang-N/.
  const links: ChapterLink[] = [];
  for (let page = 1; page <= meta.totalPages; page++) {
    const url = page === 1 ? listingUrl : `${base}/trang-${page}/`;
    links.push(...parseChapterLinks(await fetchHtml(url)));
    await sleep(THROTTLE_MS);
  }
  // Dedupe theo URL, GIỮ thứ tự xuất hiện. Số chương = vị trí (1-based) trong
  // thứ tự đọc — bền với truyện chia quyển / sub-chương / số reset theo quyển.
  const seen = new Set<string>();
  const all = links
    .filter((l) => (seen.has(l.url) ? false : (seen.add(l.url), true)))
    .map((l, i) => ({ ...l, number: i + 1 }));
  console.log(`  tổng ${all.length} chương`);

  // Resume: bỏ chương đã có (theo số vị trí — ổn định vì thứ tự nguồn cố định).
  const done = await existingChapterNumbers(novelId);
  let todo = all.filter((c) => !done.has(c.number));
  if (done.size) console.log(`  bỏ qua ${done.size} chương đã có (resume)`);
  if (opts.limit) todo = todo.slice(0, opts.limit);

  console.log(`  sẽ crawl ${todo.length} chương${opts.limit ? ` (--limit ${opts.limit})` : ''}`);

  let consecutiveErrors = 0;
  for (let i = 0; i < todo.length; i++) {
    const ch = todo[i];
    try {
      const content = parseChapterContent(await fetchHtml(ch.url));
      if (!content) {
        console.warn(`  ⚠ chương ${ch.number} rỗng, bỏ qua`);
      } else {
        await upsertChapter(novelId, ch.number, ch.title, content);
        consecutiveErrors = 0;
      }
    } catch (e) {
      if (e instanceof ChallengeError) {
        console.error(`\n✖ ${e.message}`);
        console.error(`  Đã lưu tới trước chương ${ch.number}. Chạy lại lệnh để tiếp tục.`);
        process.exit(1);
      }
      consecutiveErrors++;
      console.warn(`  ⚠ chương ${ch.number} lỗi (${consecutiveErrors}/${MAX_CONSECUTIVE_ERRORS}): ${e instanceof Error ? e.message : e}`);
      if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
        console.error(`\n✖ ${MAX_CONSECUTIVE_ERRORS} lỗi liên tiếp — dừng. Chạy lại lệnh để resume.`);
        process.exit(1);
      }
    }

    if ((i + 1) % 25 === 0 || i + 1 === todo.length) {
      console.log(`  ${i + 1}/${todo.length} chương`);
    }
    await sleep(THROTTLE_MS);
  }

  console.log(`✓ Xong. Truyện "${meta.title}" đang ở trạng thái nháp — duyệt trong admin để đăng.`);
}
