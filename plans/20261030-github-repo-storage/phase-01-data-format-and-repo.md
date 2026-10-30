---
phase: 1
title: "Format + repo data"
status: in-progress
priority: P1
effort: "3h"
dependencies: []
---

# Phase 1: Format + repo data

## Overview
Chốt định dạng file, đặt kiểu dùng chung trong `packages/shared`, tạo repo `novel-data` + branch `state`. Mọi phase sau bám vào đây.

## Requirements
- Functional: web và crawler dùng chung 1 bộ type + hàm path (không lặp chuỗi path).
- Non-functional: không bao giờ phải list thư mục (Contents API cắt ở 1000 entry); file chương ~10KB.

## Architecture
Repo `novel-data` (private), branch `main`:
```
index.json                       { updatedAt, genres:[{slug,name}], novels:[IndexNovel] }
novels/<slug>/meta.json          NovelMeta
novels/<slug>/cover.jpg          ≤100KB, optional
novels/<slug>/chapters.json      [{ n, title }] sorted by n
novels/<slug>/chapters/00001.txt nội dung thuần, đoạn cách nhau dòng trống
```
Branch `state` (orphan): `state/<userId>.json`
```
{ library: [{ slug, addedAt }],
  progress: { [slug]: { chapter: number, scroll: 0..1, updatedAt } } }
```
- `NovelMeta`: slug, title, author, description, status (`ongoing|completed`), genres (slug[]), cover (`cover.jpg`|null), featured (bool), sourceUrl, createdAt, updatedAt.
- `IndexNovel`: meta rút gọn + `chapterCount`. **`index.json` là derived** — sinh lại từ các `meta.json` + `chapters.json`, không sửa tay, không incremental.
- Genres seed (từ migration `init.sql`) → trường `genres` trong `index.json`.
- Số chương pad 5 chữ số: `chapterPath(slug, n)`.

## Related Code Files
- Create: `packages/shared/src/store.ts` (types + `chapterPath`, `metaPath`, `coverPath`, `statePath`; `userIdFromEmail` để phase 4)
- Create: `packages/shared/src/store.test.ts`
- Modify: `packages/shared/src/index.ts` (export store)
- Keep: `database.types.ts`, `models.ts` tới phase 6

## Implementation Steps
1. Viết `store.ts` theo spec trên; `userIdFromEmail` = sha256(lowercase email) hex, 32 ký tự đầu (không đặt trong shared: shared chạy cả edge/proxy, hàm này nằm trong `apps/web` ở phase 4).
2. Test: path pad 5, slug an toàn (không `..`, không `/`), hash ổn định.
3. Tạo repo private `novel-data`; commit `index.json` với `genres` seed từ `supabase/migrations/20260812000000_init.sql` (trước khi phase 6 xoá), `novels: []`.
4. Tạo branch `state` orphan chỉ có `state/.gitkeep`:
   `git checkout --orphan state && git rm -rf . && mkdir state && touch state/.gitkeep && git add . && git commit -m "init state" && git push -u origin state`
5. Tạo fine-grained PAT: chỉ repo `novel-data`, quyền Contents Read/Write → dùng cho web (Vercel). Crawler dùng git credential sẵn có của máy.

## Success Criteria
- [x] `pnpm --filter shared test` xanh
- [ ] Repo + 2 branch tồn tại; PAT đọc được `index.json` qua `curl` với `Accept: application/vnd.github.raw+json`

## Risk Assessment
- Format sai khó sửa khi đã có data → chốt kỹ ở đây, đừng thêm field "để sau".
- Slug từ input ngoài → validate trước khi nối path (path traversal vào repo/API).
