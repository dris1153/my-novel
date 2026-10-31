---
phase: 5
title: "Chi tiết truyện + mục lục"
status: completed
priority: P1
effort: "4h"
dependencies: [2, 3]
---

# Phase 5: Chi tiết truyện + mục lục

## Overview
Trang chi tiết theo mockup A: header nhuộm màu bìa, bìa lớn giữa, tên serif, chip, mô tả gập/mở, chương mới nhất, thanh hành động ghim đáy. Mục lục có trạng thái đã đọc.

## Requirements
- Functional:
  - Header: nút quay lại + mục lục (tròn, nền mờ trên gradient); gradient `radial-gradient(90% 80% at 50% 0, <coverColor>/75%, transparent)`.
  - Khối giữa: bìa 136×204, tên (Noto Serif 22px), tác giả, "Trạng thái · N chương · cập nhật …", chip thể loại (link tới thể loại).
  - Mô tả 3–4 dòng + "Xem thêm" (giữ `description-accordion` logic, đổi giao diện).
  - "Chương mới nhất" 3–5 dòng + link "Mục lục (N)".
  - Thanh ghim đáy: nút ♡ theo dõi (52×52) + nút chính "Đọc tiếp chương N" / "Đọc từ đầu" (cao 52). Trên trang chi tiết **ẩn tab bar** để thanh này là duy nhất ở đáy.
  - Mục lục: dòng = số + tên; chương đang đọc làm nổi (nền surface + nhãn "Đang đọc"); chương < chương đang đọc mờ hơn; phân trang giữ nguyên.
- Non-functional: thanh ghim tôn trọng safe-area; nội dung không bị che (padding đáy).

## Architecture
- `NovelHero` viết lại; `NovelActions` → `NovelActionBar` (server lấy state, client `FollowButton` giữ nguyên logic).
- TabBar nhận biết `/truyen/[slug]` (không phải `/chuong/`) → ẩn; layout `(site)` không đổi.
- Mục lục đọc `progress[slug].chapter` qua `readMyStateOrEmpty`.

## Related Code Files
- Modify: `app/(site)/truyen/[slug]/page.tsx`, `app/(site)/truyen/[slug]/muc-luc/page.tsx`, `app/(site)/truyen/[slug]/muc-luc/trang/[page]/page.tsx`, `components/novel/{novel-hero,novel-actions,follow-button,description-accordion,chapter-list,chapter-preview,toc-list,chapter-list-skeleton}.tsx`, `components/chrome/tab-bar.tsx`
- Create: không bắt buộc (đổi tên `novel-actions` → giữ tên file, đổi giao diện)

## Implementation Steps
1. Hero mới với gradient từ `coverColor` (fallback `surface`).
2. Mô tả + chương mới nhất theo token mới.
3. Thanh ghim đáy + ẩn tab bar trên trang chi tiết.
4. Mục lục: trạng thái đã đọc/đang đọc; dòng cao ≥48px.
5. Kiểm 390px: thanh ghim không che nút cuối danh sách.

## Success Criteria
- [ ] Header đổi màu theo bìa (thử 2 truyện màu khác nhau, hoặc 1 truyện + fallback)
- [ ] "Đọc tiếp chương N" đúng chương đã lưu; ♡ hoạt động như cũ
- [ ] Mục lục làm nổi đúng chương đang đọc

## Risk Assessment
- Gradient màu bìa sáng làm chữ trên header khó đọc → chữ nằm dưới vùng gradient (đã mờ dần về `bg`); `coverColor` đã kẹp độ sáng ở phase 3.
