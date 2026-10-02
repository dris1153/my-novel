---
phase: 7
title: "Reader"
status: done
priority: P1
effort: "1.5d"
dependencies: [6]
---

# Phase 7: Reader

## Overview

Trang đọc chương: giữ 4 theme vùng đọc + cỡ chữ + Literata @1.8, thêm mục lục, resume đúng
vị trí, prev/next, phím tắt, topbar auto-hide.

## Related Code Files

- Create: `apps/web/src/app/truyen/[slug]/chuong-[so]/page.tsx`
- Create: `apps/web/src/components/reader/{reader-shell,reader-settings,toc-sheet,chapter-nav,progress-bar}.tsx`
- Create: `apps/web/src/hooks/use-reader-prefs.ts` (localStorage)
- Modify: `apps/web/src/lib/queries.ts` (`fetchChapter`)

## Steps

1. `fetchChapter(novelSlug, number)` — chương + prev/next + tổng số chương.
2. `ReaderShell`: cột ~680px, typography Literata 1.8, 4 theme (Giấy/Ngả vàng/Đêm/OLED).
3. `ReaderSettings`: cỡ chữ, theme, kiểu chữ; lưu localStorage.
4. Resume: đọc `reading_progress.percent`, cuộn tới; ghi tiến độ throttle 5s nếu đã đăng nhập.
5. `TocSheet`, prev/next + `←/→` phím tắt, topbar auto-hide khi cuộn.
6. Đếm view qua route handler `POST /api/view`.

## Success Criteria

- [x] 4 theme + Literata @1.8 nguyên vẹn
- [x] Tiến độ lưu và mở lại đúng chỗ
- [x] Prev/next đúng, không link sang chương nháp
- [x] HTML nội dung chương có trong view-source
