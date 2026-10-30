import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { NovelMeta } from 'shared/src/store.ts';
import { makeIndex } from './build-index.ts';

const meta = (slug: string, updatedAt: string): NovelMeta => ({
  slug,
  title: slug,
  author: 'a',
  description: null,
  status: 'ongoing',
  genres: ['tien-hiep'],
  cover: null,
  featured: false,
  sourceUrl: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt,
});

test('makeIndex sắp theo updatedAt giảm dần, cùng mốc thì theo slug', () => {
  const idx = makeIndex(
    [],
    [
      { meta: meta('b', '2026-02-01T00:00:00.000Z'), chapterCount: 3 },
      { meta: meta('a', '2026-02-01T00:00:00.000Z'), chapterCount: 1 },
      { meta: meta('c', '2026-03-01T00:00:00.000Z'), chapterCount: 2 },
    ]
  );
  assert.deepEqual(idx.novels.map((n) => n.slug), ['c', 'a', 'b']);
  assert.equal(idx.novels[0].chapterCount, 2);
  assert.equal(idx.updatedAt, '2026-03-01T00:00:00.000Z');
});

test('makeIndex rỗng → updatedAt null', () => {
  assert.deepEqual(makeIndex([], []), { updatedAt: null, genres: [], novels: [] });
});
