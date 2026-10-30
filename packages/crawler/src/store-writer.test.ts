import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { ChapterStore, touchNovel, upsertNovelMeta } from './store-writer.ts';

const input = {
  slug: 'dai-phung',
  title: 'Đại Phụng',
  author: 'x',
  description: null,
  status: 'ongoing' as const,
  genres: [],
  sourceUrl: 'https://truyenfull.live/dai-phung/',
  hasNewCover: false,
};

test('crawl lại giữ featured, createdAt, bìa cũ', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'novel-'));
  try {
    upsertNovelMeta(dir, { ...input, hasNewCover: true }, '2026-01-01T00:00:00.000Z');
    const file = path.join(dir, 'novels/dai-phung/meta.json');
    const first = JSON.parse(readFileSync(file, 'utf8'));
    first.featured = true;
    // Mô phỏng người dùng bật featured bằng tay trong repo.
    writeFileSync(file, JSON.stringify(first));

    const again = upsertNovelMeta(dir, { ...input, title: 'Đại Phụng 2' }, '2026-06-01T00:00:00.000Z');
    assert.equal(again.featured, true);
    assert.equal(again.cover, 'cover.jpg');
    assert.equal(again.createdAt, '2026-01-01T00:00:00.000Z');
    assert.equal(again.title, 'Đại Phụng 2');
    assert.equal(again.updatedAt, '2026-01-01T00:00:00.000Z');

    touchNovel(dir, 'dai-phung', '2026-07-01T00:00:00.000Z');
    assert.equal(JSON.parse(readFileSync(file, 'utf8')).updatedAt, '2026-07-01T00:00:00.000Z');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('upsertNovelMeta từ chối truyện khác nguồn nhưng trùng slug', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'novel-'));
  try {
    upsertNovelMeta(dir, input);
    assert.throws(() => upsertNovelMeta(dir, { ...input, sourceUrl: 'https://truyenfull.live/khac/' }), /truyện khác/);
    // Cùng đường dẫn, khác domain/dấu / cuối → vẫn là cùng truyện.
    upsertNovelMeta(dir, { ...input, sourceUrl: 'https://truyenfull.vn/dai-phung' + '/' });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('ChapterStore resume: chương đã flush thì has() = true, sắp theo n', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'novel-'));
  try {
    const a = new ChapterStore(dir, 'dai-phung');
    a.write(2, 'Hai', 'nội dung 2');
    a.write(1, 'Một', 'nội dung 1');
    a.flush();

    const b = new ChapterStore(dir, 'dai-phung');
    assert.equal(b.has(1), true);
    assert.equal(b.has(3), false);
    assert.equal(b.size, 2);
    const list = JSON.parse(readFileSync(path.join(dir, 'novels/dai-phung/chapters.json'), 'utf8'));
    assert.deepEqual(list.map((e: { n: number }) => e.n), [1, 2]);
    assert.equal(readFileSync(path.join(dir, 'novels/dai-phung/chapters/00001.txt'), 'utf8'), 'nội dung 1\n');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
