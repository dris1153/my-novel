---
phase: 6
title: "Chi tiết truyện + Mục lục"
status: done
priority: P1
effort: "1d"
dependencies: [3]
---

# Phase 6: Chi tiết truyện + Mục lục

## Overview

Hero ink-violet, stats, tag forest, CTA sepia "Đọc từ đầu/Đọc tiếp" + ghost "Theo dõi",
mô tả accordion, danh sách chương **phân trang** (truyện 2000+ chương không được khựng).

## Related Code Files

- Create: `apps/web/src/app/truyen/[slug]/page.tsx`
- Create: `apps/web/src/app/truyen/[slug]/muc-luc/page.tsx` (TOC đầy đủ)
- Create: `apps/web/src/components/novel/chapter-list.tsx`, `follow-button.tsx`
- Modify: `apps/web/src/lib/queries.ts` (`fetchNovel`, `fetchChapterList` có offset)

## Steps

1. Metadata + JSON-LD `Book` (phase 9 hoàn thiện).
2. Hero violet: bìa, tên (serif), tác giả, tag forest, stats (chương/lượt đọc/cập nhật).
3. CTA sepia duy nhất; nếu đã đọc → "Đọc tiếp chương N".
4. Chapter list: phân trang server-side, sắp xếp mới nhất/cũ nhất, link `muc-luc`.
5. Follow button (♡) — dùng `library`; ẩn danh thì dẫn `/dang-nhap`.
6. Mô tả dài → accordion.

## Success Criteria

- [x] Truyện 2000+ chương: trang chỉ tải 1 trang chương
- [x] Chỉ 1 CTA sepia
- [x] Ẩn danh không thấy truyện/chương nháp
