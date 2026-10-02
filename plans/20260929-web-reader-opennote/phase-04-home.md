---
phase: 4
title: "Trang chủ"
status: done
priority: P1
effort: "1d"
dependencies: [3]
---

# Phase 4: Trang chủ

## Overview

Trang chủ theo wireframe `01 · Trang chủ`: panel ink-violet "Đề cử tuần" (một panel/trang),
Đọc tiếp, chips thể loại, rail Nổi bật, danh sách Mới cập nhật + tải thêm.

## Related Code Files

- Create: `apps/web/src/app/page.tsx`, `src/components/novel/*`
- Create: `apps/web/src/lib/queries.ts` (server-side)
- Modify: `apps/web/src/app/globals.css` nếu cần

## Steps

1. `queries.ts`: `fetchRecent(limit, offset)`, `fetchPopular`, `fetchFeatured`, `fetchGenres`.
2. Panel Đề cử: 1 truyện (featured, fallback top view_count), CTA ghost-light "Đọc từ đầu".
3. Đọc tiếp: chỉ hiện khi đăng nhập, đọc `reading_progress` mới nhất, link tới chương + percent.
4. Chips thể loại → `/the-loai/[slug]`.
5. "Nổi bật" rail ngang; "Mới cập nhật" lưới + nút "Tải thêm".
6. Loading = skeleton (phase 10 gắn reveal); empty state có doodle.

## Success Criteria

- [x] Đúng **một** panel ink-violet trên trang
- [x] View-source có tên truyện thật (SSR), không chỉ khung
- [x] Ẩn danh: không hiện khối Đọc tiếp
