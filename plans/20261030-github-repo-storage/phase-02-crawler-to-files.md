---
phase: 2
title: "Crawler ghi file + git push"
status: completed
priority: P1
effort: "4h"
dependencies: [1]
---

# Phase 2: Crawler ghi file + git push

## Overview
`packages/crawler` thôi ghi Supabase/R2; ghi file vào clone `novel-data`, commit theo lô, push thẳng main, sinh lại `index.json`.

## Requirements
- Functional: giữ `parse.ts`/`fetch.ts` nguyên; resume = bỏ qua chương có file; crawl lại không mất `featured`/bìa; lỗi giữa chừng vẫn push những gì đã có.
- Non-functional: crawler chạy local, dùng git credential của máy; không cần token.

## Architecture
```
cli.ts ─► crawl.ts ─► parse/fetch (giữ)
              │
              └► store-writer.ts  ghi meta/cover/chapters.json/chapters/*.txt vào DATA_REPO_DIR
              └► git-batch.ts     mỗi 100 chương (và khi kết thúc/lỗi): git add → commit → pull --rebase → push
              └► build-index.ts   sinh index.json từ meta + chapters.json (cuối lần crawl)
```
Không còn dữ liệu cũ để giữ: crawl là đường nhập duy nhất, repo bắt đầu rỗng.
Env: `DATA_REPO_DIR` (đường dẫn clone `novel-data`) trong root `.env`.

## Related Code Files
- Create: `packages/crawler/src/store-writer.ts`, `git-batch.ts`, `build-index.ts` (+ test)
- Modify: `packages/crawler/src/crawl.ts`, `cli.ts` (bỏ `--draft`, bỏ publish), `package.json` (bỏ `@supabase/supabase-js`, aws-sdk; thêm `sharp`)
- Delete: `packages/crawler/src/writer.ts`
- Giữ nguyên: `parse.ts`, `fetch.ts` + test

## Implementation Steps
1. `store-writer`: `upsertNovelMeta` (ghi đè metadata, **giữ** `featured`, `createdAt`, `cover` cũ nếu không có bìa mới), `writeChapter(n, title, text)`, `existingChapterNumbers` (đọc `chapters.json` + check file), `writeCover` (sharp).
2. `chapters.json`: cập nhật theo lô cùng commit (merge theo `n`, sort).
3. `git-batch`: dùng `execFile('git', …)`; trước khi crawl `git pull --rebase` clone; push lỗi (non-fast-forward) → pull --rebase rồi thử lại ≤3.
4. `build-index`: đọc mọi `novels/*/meta.json` + `chapters.json` → `index.json` (sort `updatedAt` desc); commit riêng ở cuối.
5. Mapping genre: giữ hành vi cũ (genre không có trong `genres` của index → log, bỏ qua). Nguồn genres = `index.json.genres`.
6. Test: `build-index` (2 meta mẫu → index đúng, ổn định thứ tự), resume (file có sẵn → không ghi lại).

## Success Criteria
- [x] `pnpm crawl <url> --limit N` → file + meta + bìa, commit theo lô, push main (test trên origin tạm)
- [x] Chạy lại → resume (bỏ qua chương đã có), chỉ commit phần mới
- [ ] Ngắt giữa chừng (Ctrl+C) rồi chạy lại → tiếp từ chỗ dừng (chưa test; file chưa flush bị fetch lại, không mất data)
- [x] `pnpm --filter crawler test` + `typecheck` xanh

## Risk Assessment
- Hai crawl song song cùng clone → conflict: ghi chú trong README "một lần một crawl".
- Cloudflare challenge: giữ hành vi cũ (dừng sạch, resume).
- Push main trực tiếp: nếu main có branch protection → tắt cho owner hoặc dùng bypass (không dùng PR theo quyết định).
