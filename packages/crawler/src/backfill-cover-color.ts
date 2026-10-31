import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { coverPath, metaPath, type NovelMeta } from 'shared/src/store.ts';

import { buildIndex } from './build-index.ts';
import { assertDataRepo, commitAndPush, syncFromRemote } from './git-batch.ts';
import { coverColorOf, dataDir, writeJson } from './store-writer.ts';

// Tính `coverColor` cho các truyện crawl trước khi có trường này. Chạy lại an toàn:
// truyện đã có màu thì bỏ qua, không có gì mới thì không commit.
try {
  process.loadEnvFile?.(new URL('../../../.env', import.meta.url));
} catch {
  // .env không tồn tại; dataDir() sẽ báo rõ nếu thiếu biến.
}

const dir = dataDir();
await assertDataRepo(dir);
await syncFromRemote(dir);

const root = path.join(dir, 'novels');
let updated = 0;
for (const slug of existsSync(root) ? readdirSync(root) : []) {
  const metaFile = path.join(dir, metaPath(slug));
  if (!existsSync(metaFile)) continue;
  const meta = JSON.parse(readFileSync(metaFile, 'utf8')) as NovelMeta;
  if (!meta.cover || meta.coverColor) continue;

  meta.coverColor = await coverColorOf(readFileSync(path.join(dir, coverPath(slug))));
  writeJson(dir, metaPath(slug), meta);
  updated++;
  console.log(`  ${slug}: ${meta.coverColor}`);
}

buildIndex(dir);
const pushed = await commitAndPush(dir, 'chore(data): backfill cover colors');
console.log(`✓ ${updated} truyện được tính màu${pushed ? ', đã push.' : ', không có gì để push.'}`);
