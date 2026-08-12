import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { isChallengePage } from './fetch.ts';

const dir = dirname(fileURLToPath(import.meta.url));
const listing = readFileSync(join(dir, '../test/fixtures/listing.html'), 'utf8');

test('trang 200 hợp lệ KHÔNG bị nhận nhầm là challenge', () => {
  // Fixture là trang thật có nhúng widget cf-turnstile — không được coi là challenge.
  assert.equal(isChallengePage(listing), false);
});

test('trang challenge thật bị bắt', () => {
  assert.equal(isChallengePage('<html><head><title>Just a moment...</title></head></html>'), true);
  assert.equal(isChallengePage('<title>Attention Required! | Cloudflare</title>'), true);
});
