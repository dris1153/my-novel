---
phase: 3
title: "Dữ liệu: coverColor + state.seen"
status: completed
priority: P1
effort: "3h"
dependencies: []
---

# Phase 3: Dữ liệu — coverColor + state.seen

## Overview
Hai thay đổi dữ liệu nhỏ mà UI cần: màu chủ đạo của bìa (tính lúc crawl) và số chương người dùng đã thấy (cho badge "+N chương mới").

## Requirements
- Functional:
  - `NovelMeta.coverColor: string | null` (hex) và `IndexNovel.coverColor`; crawler tính khi ghi bìa; script bù cho truyện đã có.
  - `UserState.seen?: Record<slug, number>`; cập nhật = `chapterCount` hiện tại khi (a) ghi tiến độ đọc, (b) bấm theo dõi.
  - Badge = `max(0, chapterCount − seen[slug])`; chưa có `seen[slug]` → 0.
- Non-functional: không thêm lần ghi state riêng (ghép vào lần ghi sẵn có); file state cũ (không có `seen`) vẫn đọc được.

## Architecture
- Crawler `writeCover`: sau khi nén, `sharp(buf).resize(64,64,{fit:'cover'}).stats()` → `dominant {r,g,b}`; kẹp độ sáng (HSL L trong [0.25, 0.55], S ≤ 0.6) để gradient không phá tương phản chữ → hex. Trả về cùng `hasNewCover`; `upsertNovelMeta` giữ `coverColor` cũ nếu không có bìa mới.
- `makeIndex` copy `coverColor`.
- Backfill: `packages/crawler/src/backfill-cover-color.ts` đọc `novels/*/cover.jpg` trong `DATA_REPO_DIR`, ghi meta, `buildIndex`, commit + push (dùng `git-batch`). Chạy 1 lần, giữ lại script (rẻ, dùng khi đổi thuật toán).
- Web `state-ops.ts`: `markSeen(state, slug, count)` (trả state cũ nếu không đổi); `setProgress` route và `setNovelSaved` action gọi thêm `markSeen` trong cùng `apply` (số chương lấy từ `index.json` đã cache).
- `queries.ts`: `NovelCard`/`NovelDetail` mang `coverColor`.

## Related Code Files
- Modify: `packages/shared/src/store.ts` (+ test), `packages/crawler/src/{store-writer,build-index,crawl}.ts` (+ test), `apps/web/src/lib/{state-ops,queries}.ts` (+ `state-ops.test.ts`), `apps/web/src/app/api/progress/route.ts`, `apps/web/src/lib/actions.ts`
- Create: `packages/crawler/src/backfill-cover-color.ts`, script `backfill:colors` trong `packages/crawler/package.json`

## Implementation Steps
1. Type: thêm `coverColor` (nullable) và `seen?` (optional) — optional để dữ liệu cũ không vỡ.
2. Hàm thuần `clampCoverColor({r,g,b}) → hex` + test (màu quá sáng/quá tối/xám).
3. Crawler ghi `coverColor`; index copy; test `makeIndex` cập nhật.
4. Backfill script; chạy trên clone `novel-data` thật (1 truyện hiện có) → commit/push.
5. `markSeen` + test (không đổi → cùng tham chiếu; chưa có → thêm).
6. Gắn `markSeen` vào `/api/progress` và `setNovelSaved(true)`.

## Success Criteria
- [ ] `index.json` có `coverColor` cho truyện có bìa
- [ ] Đọc 1 chương → `state/<id>.json` có `seen[slug]` = số chương hiện tại, chỉ 1 commit
- [ ] Test shared/crawler/web xanh

## Risk Assessment
- Màu chủ đạo của bìa tối/xám → gradient nhạt: kẹp độ sáng; null → dùng màu `surface` mặc định.
- `seen` tăng lượng dữ liệu state: tối đa = số truyện đã đọc/theo dõi, nhỏ.
