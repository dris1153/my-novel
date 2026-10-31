---
phase: 5
title: "Trang truyện + mục lục"
status: completed
priority: P1
effort: "3h"
dependencies: [3]
---

# Phase 5: Trang truyện + mục lục

## Overview
Trang truyện kiểu TruyenYY: khối trắng có bìa trái + thông tin + hàng nút + bảng thông tin; giới thiệu, chương mới nhất, truyện cùng thể loại. Bỏ thanh hành động ghim đáy. Mục lục đổi kiểu.

## Requirements
- Khối đầu (`bg-surface rounded-card`): bìa trái (120px mobile / 180px desktop) + bên phải: tên (`font-heading` đậm, 22–30px), tác giả (`text-fg-2`), badge trạng thái (Đang ra / Hoàn thành / Tạm ngưng), chip thể loại (`Tag` viền xanh, link `/the-loai/[slug]`).
- Hàng nút (dưới khối thông tin, full-width trên mobile): primary "Đọc tiếp chương N" / "Đọc từ đầu" (logic cũ của `NovelActions`), secondary "DS.Chương" (→ `/truyen/[slug]/muc-luc`), `FollowButton` (có chữ "Theo dõi"/"Đang theo dõi", không icon-only). Không có chương → nút primary disabled "Chưa có chương nào".
- Bảng thông tin: Thể loại · Trạng thái · Số chương (`text-hot-fg`) · Cập nhật (dd/MM/yyyy từ `updatedAt`).
- Giới thiệu: `DescriptionAccordion` trong khối trắng, tiêu đề `SectionHeading`.
- Chương mới nhất: 5 dòng (số + tên; data không có giờ từng chương), action "Mục lục (N)".
- Truyện cùng thể loại: `fetchByGenre(genres[0], 9)` bỏ chính nó, lấy 8 → `Shelf`; ẩn nếu rỗng.
- Mục lục: khối trắng, dòng chương 1 cột mobile / 2 cột desktop, chương đang đọc `bg-accent-soft text-accent-fg`, `PageNav` kiểu nút xám/xanh.

## Architecture
- `NovelHero` viết lại thành layout ngang; nhận `resume`/`firstNumber`/`saved` từ trang (trang đọc `readMyStateOrEmpty()` một lần — giữ đúng hành vi cũ của `NovelActions`).
- Gộp phần nút vào `components/novel/novel-actions.tsx` (giữ tên file, đổi thành hàng nút inline thay vì `fixed`) — ít đổi import nhất.
- Không còn khối nền tint (đã gỡ ở phase 1).
- Chỉ thêm 1 lần đọc GitHub (`fetchByGenre` dùng index đã cache) → không tốn rate limit thêm.

## Related Code Files
- Modify: `app/(site)/truyen/[slug]/page.tsx`, `components/novel/{novel-hero,novel-actions,follow-button,chapter-preview,chapter-list,toc-header,toc-list,description-accordion}.tsx`, `components/ui/page-nav.tsx`, `app/(site)/truyen/[slug]/muc-luc/**`
- Không xoá file

## Implementation Steps
1. `NovelActions` → hàng nút inline (primary + secondary + follow); `FollowButton` bản có chữ.
2. `NovelHero` bố cục bìa trái + bảng thông tin; badge trạng thái dùng map `StoredNovelStatus` → nhãn tiếng Việt (có sẵn ở đâu thì dùng lại).
3. Trang truyện: thứ tự khối mới, thêm "Truyện cùng thể loại".
4. Mục lục + `PageNav` đổi kiểu.
5. Chụp 390/1440 trang truyện (truyện dài + truyện chưa có chương) và mục lục.

## Success Criteria
- [ ] Không còn phần tử `fixed` ở trang truyện; tab bar hiện và không đè nút
- [ ] "Đọc tiếp chương N" đúng như trước (đã đọc / chưa đọc / chưa có chương)
- [ ] Truyện cùng thể loại không chứa chính truyện đó

## Risk Assessment
- Mất "hành động chính luôn trong tầm tay" khi bỏ thanh ghim → hàng nút đặt ngay dưới khối đầu, trên giới thiệu.
- Bìa trái + tên dài ở 360px chật → tên `line-clamp-3`, bìa 104px dưới 380px.
