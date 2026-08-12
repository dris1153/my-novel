import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { parseChapterContent, parseChapterLinks, parseListingMeta } from './parse.ts';

const dir = dirname(fileURLToPath(import.meta.url));
const fx = (name: string) => readFileSync(join(dir, '../test/fixtures', name), 'utf8');
const listing = fx('listing.html');
const chapter = fx('chapter.html');
const listingVolumes = fx('listing-volumes.html'); // truyện chia quyển

test('parseListingMeta bóc đúng metadata truyện', () => {
  const m = parseListingMeta(listing);
  assert.equal(m.title, 'Đại Phụng Đả Canh Nhân');
  assert.equal(m.author, 'Mại Báo Tiểu Lang Quân');
  assert.equal(m.status, 'completed'); // "Full"
  assert.equal(m.totalPages, 42);
  assert.ok(m.coverUrl?.startsWith('https://'), 'có cover URL');
  assert.ok(m.description && m.description.length > 20, 'có mô tả');
});

test('parseListingMeta chỉ lấy genre trong .info, không dính menu', () => {
  const { genreSlugs } = parseListingMeta(listing);
  // Genre thật của truyện này, không phải toàn bộ menu site.
  assert.deepEqual(genreSlugs, [
    'kiem-hiep',
    'di-gioi',
    'huyen-huyen',
    'linh-di',
    'xuyen-khong',
    'trinh-tham',
    'co-dai',
  ]);
  // Menu site có ngon-tinh/dam-my — phải KHÔNG lọt vào.
  assert.ok(!genreSlugs.includes('ngon-tinh'));
  assert.ok(!genreSlugs.includes('dam-my'));
});

test('parseChapterLinks trả 50 chương theo thứ tự, từ 1 trang listing', () => {
  const links = parseChapterLinks(listing);
  assert.equal(links.length, 50);
  assert.match(links[0].url, /\/chuong-1\/$/);
  assert.match(links[49].url, /\/chuong-50\/$/);
  assert.ok(links[0].title.length > 0);
});

test('parseChapterLinks bắt được truyện chia quyển (/quyen-M-chuong-N/) và sub-chương', () => {
  const links = parseChapterLinks(listingVolumes);
  assert.equal(links.length, 50);
  assert.match(links[0].url, /quyen-1-chuong-1\/$/);
  // Sub-chương "chuong-1-2" phải được giữ như một chương riêng, theo thứ tự.
  assert.ok(
    links.some((l) => /quyen-1-chuong-1-2\/$/.test(l.url)),
    'có sub-chương quyen-1-chuong-1-2'
  );
  // Không dính link điều hướng /top-truyen/...-chuong/
  assert.ok(!links.some((l) => l.url.includes('/top-truyen/')));
});

test('parseChapterContent trả text có ngăn đoạn, sạch tag', () => {
  const content = parseChapterContent(chapter);
  assert.ok(content.includes('Hứa Thất An'), 'có nội dung thật');
  assert.ok(content.includes('\n\n'), 'có ngăn đoạn');
  assert.ok(!/<[a-z]/i.test(content), 'không còn tag HTML');
  assert.ok(content.length > 1000, 'nội dung đủ dài');
});
