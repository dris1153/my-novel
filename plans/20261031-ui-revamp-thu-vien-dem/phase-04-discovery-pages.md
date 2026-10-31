---
phase: 4
title: "Khám phá: trang chủ, thể loại, tìm kiếm"
status: completed
priority: P1
effort: "5h"
dependencies: [2, 3]
---

# Phase 4: Khám phá — trang chủ, thể loại, tìm kiếm

## Overview
Làm lại trang chủ theo mockup A (+ chip thể loại, banner thủy mặc của B), trang Thể loại bằng ô chữ + ghép bìa thật, trang thể loại con và tìm kiếm.

## Requirements
- Functional:
  - Trang chủ: thẻ "Đang đọc" (gradient từ `coverColor`, bìa, tên serif, "Chương X / Y · tên chương", thanh tiến độ, nút "Đọc tiếp") — chưa đọc gì → banner thủy mặc (placeholder tới phase 8) + câu dẫn; hàng chip thể loại cuộn ngang; kệ "Mới cập nhật" (8 truyện, cuộn ngang, bìa 104×156); lưới "Tất cả truyện" (3 cột mobile, 4 tablet, 6 desktop).
  - Thể loại: lưới ô 2 cột (mobile) — tên thể loại (Noto Serif) + số truyện + ghép 2–4 bìa thật xếp nghiêng; thể loại 0 truyện vẫn hiện, mờ hơn.
  - Thể loại con + Tìm kiếm: header + lưới như trang chủ; empty state dùng component art (placeholder).
- Non-functional: thẻ bìa luôn hiện tên dưới bìa (không chỉ alt); ảnh bìa có `width/height` cố định (không layout shift); kệ ngang có `scroll-snap`, không cuộn ngang cả trang.

## Architecture
- Component dùng chung: `NovelCover` (bìa 2:3, radius cover, bóng mềm, fallback màu `coverColor`), `NovelGridCard` (bìa + tên 2 dòng + "N chương"), `Shelf` (tiêu đề + cuộn ngang), `ContinueCard` (thay `continue-reading.tsx`).
- Mosaic thể loại: query mới `fetchGenreTiles()` → mỗi genre `{slug,name,count,covers: coverUrl[] (≤4)}` từ `index.json` (không gọi thêm GitHub).
- Empty state: `components/ui/empty-state.tsx` nhận `art` (tên ảnh), tiêu đề, mô tả, hành động — phase 8 nối ảnh thật.

## Related Code Files
- Modify: `app/(site)/page.tsx`, `app/(site)/the-loai/page.tsx`, `app/(site)/the-loai/[slug]/page.tsx`, `app/(site)/the-loai/[slug]/trang/[page]/page.tsx`, `app/(site)/tim-kiem/page.tsx`, `components/novel/{novel-card,novel-cover,genre-list,genre-chips,novel-grid-skeleton,continue-reading}.tsx`, `lib/queries.ts`
- Create: `components/novel/shelf.tsx`, `components/novel/genre-tile.tsx`, `components/ui/empty-state.tsx`

## Implementation Steps
1. `NovelCover` + `NovelGridCard` mới (dùng ở mọi lưới).
2. `ContinueCard` với gradient `radial-gradient(120% 140% at 0 0, <coverColor>/55%, var(--bg-subtle) 70%)`.
3. Trang chủ ghép: ContinueCard | banner → chips → Shelf "Mới cập nhật" → lưới.
4. `fetchGenreTiles` + `GenreTile` + trang Thể loại.
5. Thể loại con, Tìm kiếm (ô tìm lớn ở đầu trang, autofocus), skeleton khớp layout.
6. EmptyState cho: thư viện trống ở trang chủ, không có kết quả, thể loại rỗng.

## Success Criteria
- [ ] Khớp mockup A ở 390px (sai khác chấp nhận được ghi lại)
- [ ] Trang chủ không cuộn ngang; kệ cuộn ngang mượt, snap
- [ ] Thể loại hiện bìa thật ghép, số truyện đúng
- [ ] Skeleton không gây nhảy layout

## Risk Assessment
- Ít truyện (hiện 1) → kệ/mosaic trông trống: ẩn kệ khi < 3 truyện, mosaic tự co còn 1 bìa.
