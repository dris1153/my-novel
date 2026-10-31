---
phase: 7
title: "Trình đọc"
status: completed
priority: P2
effort: "3h"
dependencies: [1]
---

# Phase 7: Trình đọc

## Overview
Thanh trên kiểu TruyenYY (nền slate), tiêu đề chương condensed đậm, cặp nút "‹ Trước" / "Tiếp ›" ở dưới tiêu đề và cuối chương. Giữ nguyên cơ chế: chrome tự ẩn + ghim khi focus, bottom sheet cài đặt, vạch tiến độ 2px, đồng bộ tiến độ.

## Requirements
- Thanh trên: `bg-bar text-on-bar` (không theo nền đọc) — nút về, tên truyện + "Chương N / tổng" (`text-on-bar/80`), mục lục, "Aa". Thanh dưới giữ màu theo nền đọc như cũ.
- Tiêu đề: tên truyện nhỏ (link về trang truyện) + "Chương N" + tên chương, `font-heading` đậm 24–28px, căn giữa.
- Cặp nút ngay dưới tiêu đề và cuối chương: "‹ Trước" (viền `theme.dim`, chữ `theme.fg`) / "Tiếp ›" (`bg-accent text-on-accent`); thiếu chương → nút mờ `aria-disabled`. Cuối chương thêm dòng "Hết chương N" và tên chương sau dưới nút Tiếp; hết truyện → "Bạn đã đọc tới chương mới nhất." + link về trang truyện.
- Thân truyện: Literata + 4 nền đọc giữ nguyên (`reader-themes.test.ts` không đổi).

## Architecture
- `next-chapter-card.tsx` → đổi thành `chapter-nav-pair.tsx` (một component, prop `variant: "top" | "end"`) dùng ở 2 chỗ trong `reader-shell.tsx` — DRY thay vì 2 khối nút.
- `ReaderChrome`: header dùng class token thay `style={bar}`; footer giữ `style={bar}`. Focus ring trên thanh slate: `--focus-ring: var(--on-bar)` (như phase 3).
- `reader-shell.tsx` 180 dòng — tách phần tiêu đề ra `chapter-heading.tsx` nếu vượt ~200 dòng sau khi sửa.

## Related Code Files
- Create: `components/reader/chapter-nav-pair.tsx` (thay `next-chapter-card.tsx`), có thể `components/reader/chapter-heading.tsx`
- Modify: `components/reader/{reader-chrome,reader-shell,reader-settings-sheet}.tsx`, `app/(reader)/truyen/[slug]/chuong/[so]/page.tsx` (nếu cần truyền thêm prop)
- Delete: `components/reader/next-chapter-card.tsx`

## Implementation Steps
1. `ChapterNavPair` (top/end) + thay `NextChapterCard`.
2. Tiêu đề condensed; thanh trên slate.
3. Bottom sheet: nút chọn đang bật dùng `bg-accent text-on-accent`, còn lại `bg-subtle`; radius sheet 16px.
4. Kiểm: chạm giữa bật/tắt chrome, Tab vào chrome giữ hiện, sheet `inert` nền, tiến độ vẫn lưu (POST `/api/progress`), 4 nền đọc × light/dark app.

## Success Criteria
- [ ] Không đổi hành vi: tự ẩn, ghim khi focus, sheet, lưu tiến độ
- [ ] Nút Tiếp/Trước đúng chương liền kề (dùng `prevNumber`/`nextNumber`, không ±1)
- [ ] Dấu tiếng Việt ở tiêu đề condensed không bị cắt (thử "Chương 12: Ẩn Ước Ệ Ồ Ử")

## Risk Assessment
- Thanh slate trên nền đọc "Đêm"/"Đen tuyền" ít tách biệt → giữ `border-b` mảnh `line`.
- Nút xanh trên nền sepia/giấy lệch tông → chấp nhận (đúng TruyenYY); chỉ fill, chữ trên fill đã đạt contrast.
