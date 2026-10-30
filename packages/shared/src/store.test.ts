import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chapterPath, coverPath, metaPath, statePath, isSlug } from './store.ts';

test('chapterPath pad 5 chữ số', () => {
  assert.equal(chapterPath('dai-phung', 1), 'novels/dai-phung/chapters/00001.txt');
  assert.equal(chapterPath('dai-phung', 2100), 'novels/dai-phung/chapters/02100.txt');
});

test('chapterPath từ chối số chương sai', () => {
  for (const n of [0, -1, 1.5, NaN]) assert.throws(() => chapterPath('a', n));
});

test('slug không an toàn bị từ chối (path traversal)', () => {
  for (const s of ['', '..', 'a/b', 'a/../b', 'A', 'a b', '-a', 'a-', 'a--b']) {
    assert.equal(isSlug(s), false, s);
    assert.throws(() => metaPath(s));
    assert.throws(() => coverPath(s));
  }
});

test('statePath chỉ nhận userId hex 32 ký tự', () => {
  const id = 'a'.repeat(32);
  assert.equal(statePath(id), `state/${id}.json`);
  for (const bad of ['', '../x', 'a'.repeat(31), 'A'.repeat(32), `${'a'.repeat(31)}/`]) {
    assert.throws(() => statePath(bad));
  }
});
