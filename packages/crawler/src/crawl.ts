import { slugify } from 'shared';
import { isSlug } from 'shared/src/store.ts';

import { ChallengeError, fetchHtml, sleep } from './fetch.ts';
import { parseChapterContent, parseChapterLinks, parseListingMeta, type ChapterLink } from './parse.ts';
import { buildIndex } from './build-index.ts';
import { assertDataRepo, commitAndPush, syncFromRemote } from './git-batch.ts';
import {
  ChapterStore,
  dataDir,
  knownGenreSlugs,
  touchNovel,
  upsertNovelMeta,
  writeCover,
} from './store-writer.ts';

const THROTTLE_MS = 1000; // delay giữa mỗi request chương, né rate-limit
const MAX_CONSECUTIVE_ERRORS = 5;
const COMMIT_EVERY = 100;

export type CrawlOptions = { limit?: number };

export async function crawl(listingUrl: string, opts: CrawlOptions = {}): Promise<void> {
  const base = listingUrl.replace(/\/$/, '');
  const dir = dataDir();
  await assertDataRepo(dir);
  await syncFromRemote(dir);

  console.log(`Đọc trang truyện: ${base}`);
  const meta = parseListingMeta(await fetchHtml(listingUrl));
  console.log(`  "${meta.title}" — ${meta.author} — ${meta.status} — ${meta.totalPages} trang chương`);

  const slug = slugify(meta.title);
  if (!isSlug(slug)) throw new Error(`Tiêu đề "${meta.title}" không tạo được slug hợp lệ (cần chữ Latin/số).`);
  const cover = await writeCover(dir, slug, meta.coverUrl);
  const known = knownGenreSlugs(dir);
  const genres = meta.genreSlugs.filter((g) => known.has(g));
  const missed = meta.genreSlugs.filter((g) => !known.has(g));
  if (missed.length) console.warn(`  genre không có trong index.json, bỏ qua: ${missed.join(', ')}`);
  upsertNovelMeta(dir, {
    slug,
    title: meta.title,
    author: meta.author,
    description: meta.description,
    status: meta.status,
    genres,
    sourceUrl: listingUrl,
    hasNewCover: cover.written,
    coverColor: cover.color,
  });
  const chapters = new ChapterStore(dir, slug);

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
  let todo = all.filter((c) => !chapters.has(c.number));
  if (chapters.size) console.log(`  bỏ qua ${chapters.size} chương đã có (resume)`);
  if (opts.limit) todo = todo.slice(0, opts.limit);

  console.log(`  sẽ crawl ${todo.length} chương${opts.limit ? ` (--limit ${opts.limit})` : ''}`);

  // Mỗi lô: ghi mục lục + index rồi commit/push, để ngắt giữa chừng không mất công.
  const pending: number[] = [];
  const flush = async () => {
    if (pending.length) touchNovel(dir, slug);
    chapters.flush();
    buildIndex(dir);
    const range = pending.length ? ` chapters ${pending[0]}-${pending[pending.length - 1]}` : '';
    pending.length = 0;
    await commitAndPush(dir, `crawl(${slug}):${range || ' metadata'}`);
  };

  let failure: unknown;
  try {
    let consecutiveErrors = 0;
    for (let i = 0; i < todo.length; i++) {
      const ch = todo[i];
      try {
        const content = parseChapterContent(await fetchHtml(ch.url));
        if (!content) {
          console.warn(`  ⚠ chương ${ch.number} rỗng, bỏ qua`);
        } else {
          chapters.write(ch.number, ch.title, content);
          pending.push(ch.number);
          consecutiveErrors = 0;
        }
      } catch (e) {
        if (e instanceof ChallengeError) {
          // Ném để caller (CLI) quyết định thoát — không `process.exit` ở đây, vì hàm này
          // còn được gọi từ tiến trình con của web.
          throw new Error(`${e.message}\n  Đã lưu tới trước chương ${ch.number}. Chạy lại để tiếp tục.`);
        }
        consecutiveErrors++;
        console.warn(`  ⚠ chương ${ch.number} lỗi (${consecutiveErrors}/${MAX_CONSECUTIVE_ERRORS}): ${e instanceof Error ? e.message : e}`);
        if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
          throw new Error(`${MAX_CONSECUTIVE_ERRORS} lỗi liên tiếp — dừng. Đã lưu tới trước chương ${ch.number}.`);
        }
      }

      // Ngoài try của chương: lỗi git không được tính là lỗi chương rồi crawl tiếp.
      if (pending.length >= COMMIT_EVERY) await flush();

      if ((i + 1) % 25 === 0 || i + 1 === todo.length) {
        console.log(`  ${i + 1}/${todo.length} chương`);
      }
      await sleep(THROTTLE_MS);
    }
  } catch (e) {
    failure = e;
  }
  // Luôn lưu phần đã crawl được, kể cả khi dừng vì lỗi/challenge.
  try {
    await flush();
  } catch (e) {
    failure ??= e;
  }
  if (failure) throw failure;

  console.log(`✓ Xong. Truyện "${meta.title}" hiện có ${chapters.size} chương, đã push lên repo data.`);
}
