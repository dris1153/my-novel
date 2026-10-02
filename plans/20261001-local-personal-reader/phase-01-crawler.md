---
phase: 1
title: "Crawler: bug re-crawl + auto-publish"
status: done
priority: P0
effort: "1.5h"
dependencies: []
---

# Phase 1: Crawler

## Overview

Sửa bug re-crawl (đẩy truyện về nháp + xoá bìa) và cho phép tự publish. Chuẩn bị để web
gọi được qua tiến trình con.

## Related Code Files

- Modify: `packages/crawler/src/writer.ts` (`upsertNovel` không ghi đè `published`/`cover_url`; nhận `publish`)
- Modify: `packages/crawler/src/crawl.ts` (option `publish`, bỏ `process.exit`)
- Modify: `packages/crawler/src/cli.ts` (`--draft` để quay lại hành vi cũ)

## Steps

1. `upsertNovel`: select theo slug trước → có rồi thì `update` chỉ `title/author/status/description`
   (+ `cover_url` chỉ khi có bìa mới); chưa có thì `insert` với `published = opts.publish`.
2. `crawl(url, { limit, publish })` — mặc định `publish: true`.
3. Bỏ `process.exit(1)` trong `crawl()` → `throw`. CLI bắt lỗi và exit (đã có sẵn).
4. `cli.ts`: thêm `--draft` → `publish: false`.
5. `pnpm --filter crawler typecheck` + `pnpm test`.

## Success Criteria

- [ ] Crawl lần 2 không đổi `published`, không xoá `cover_url`
- [ ] Mặc định truyện về ở trạng thái đã publish
- [ ] `crawl()` không giết process khi lỗi
- [ ] Test hiện có vẫn pass
