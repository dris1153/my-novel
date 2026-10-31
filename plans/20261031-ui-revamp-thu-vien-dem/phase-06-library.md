---
phase: 6
title: "Tủ truyện"
status: completed
priority: P2
effort: "2h"
dependencies: [2, 3]
---

# Phase 6: Tủ truyện

## Overview
Tủ truyện dạng danh sách (theo mockup C): bìa nhỏ, tên, "Chương X / Y · lúc đọc", thanh tiến độ, badge "+N chương mới".

## Requirements
- Functional:
  - Nguồn: `library` (đã theo dõi) ∪ truyện có `progress` (đang đọc). Tab/segmented: "Đang đọc" (có progress, sắp theo `progress.updatedAt` mới nhất) · "Theo dõi" (library, sắp theo `addedAt`).
  - Dòng: bìa 52×78, tên 15px/600, "Chương X / Y · <thời gian tương đối>" (chưa đọc → "Chưa đọc · Y chương"), thanh 3px = X/Y, badge "+N" nếu `chapterCount − seen[slug] > 0` (cap "99+").
  - Chạm dòng → chương đang đọc (nếu có) hoặc trang chi tiết.
  - Trống → EmptyState art "empty-library".
- Non-functional: dòng cao ≥64px; badge có `aria-label` "N chương mới".

## Architecture
- Query mới `fetchLibraryRows(state)` trong `queries.ts`: map slug → card từ `index.json`, gắn progress/seen; thuần ngoài phần đọc index → tách hàm thuần `buildLibraryRows(index, state)` để test.
- Tab dùng query param `?tab=theo-doi` (server component, không cần client state).

## Related Code Files
- Modify: `app/(site)/tu-truyen/page.tsx`, `lib/queries.ts`
- Create: `components/novel/library-row.tsx`, `lib/library-rows.ts` (+ `library-rows.test.ts`)

## Implementation Steps
1. `buildLibraryRows` + test (badge, cap 99+, sort, truyện đã bị xoá khỏi index thì bỏ).
2. `LibraryRow` component.
3. Trang Tủ truyện với 2 tab + empty state.

## Success Criteria
- [ ] Badge đúng sau khi crawl thêm chương cho truyện đang theo dõi
- [ ] Badge mất sau khi đọc 1 chương của truyện đó
- [ ] Test `library-rows` xanh

## Risk Assessment
- Truyện theo dõi trước khi có `seen` → không có badge cho tới lần đọc kế tiếp (chấp nhận, đã ghi ở phase 3).
