---
phase: 7
title: "Trình đọc"
status: completed
priority: P1
effort: "5h"
dependencies: [1]
---

# Phase 7: Trình đọc

## Overview
Trình đọc theo mockup "Trình đọc": chrome nổi không đẩy chữ, chạm giữa để bật/tắt, cuộn xuống ẩn/cuộn lên hiện, vạch tiến độ 2px luôn hiện, cài đặt trong bottom sheet (thêm giãn dòng), thẻ "Chương tiếp" cuối chương.

## Requirements
- Functional:
  - Top bar: quay lại (về trang truyện), tên truyện + "Chương X / Y · %", nút mục lục, nút "Aa".
  - Bottom bar (khi chrome hiện): ‹ chương trước · thanh % chương · chương sau ›.
  - Chạm vùng giữa (không phải link/nút, không đang bôi chọn chữ) → bật/tắt chrome; cuộn xuống > 8px → ẩn; cuộn lên → hiện; tự ẩn sau 3s khi mới mở.
  - Bottom sheet "Aa": 4 nền (Giấy, Ngả vàng, Đêm, Đen tuyền), cỡ chữ (6 mức, nút −/+), kiểu chữ (Có chân Literata / Không chân Be Vietnam Pro), **giãn dòng** (Hẹp 1.6 / Vừa 1.75 / Rộng 1.95). Đóng bằng vuốt/nhấn nền mờ/Esc.
  - Cuối chương: thẻ "Chương tiếp: <tên>" + nút, và link "Về trang truyện".
  - Phím ←/→ giữ nguyên; Esc đóng sheet.
- Non-functional: chrome chỉ animate transform/opacity (~200ms); tôn trọng `prefers-reduced-motion`; nội dung đo tối đa ~70ch trên màn rộng; dấu tiếng Việt chồng không bị cắt ở mọi mức giãn dòng.

## Architecture
- Reader themes cập nhật theo research: Giấy `#F6F3EC/#222222`, Ngả vàng `#EFE5D0/#3B3024`, Đêm `#111113/#d8dade`, Đen tuyền `#000/#b5afa6`; chrome của reader lấy màu theo theme đọc (không theo theme app).
- `lib/reader.ts`: thêm `lineHeight: "tight"|"normal"|"loose"` vào prefs (mặc định normal), key localStorage tăng `v2` (merge mặc định, không mất prefs cũ — đọc `v1` nếu có).
- `reader-shell.tsx` tách: `reader-chrome.tsx` (top/bottom bar, hiển thị theo state), `reader-settings-sheet.tsx` (thay `reader-settings.tsx`), `use-chrome-visibility.ts` (scroll/tap/timer). `use-progress-sync.ts` giữ nguyên.
- Tiêu đề chương trong reader: Be Vietnam Pro nhỏ in hoa (như mockup), thân Literata.

## Related Code Files
- Modify: `components/reader/reader-shell.tsx`, `lib/reader.ts`, `app/(reader)/truyen/[slug]/chuong/[so]/page.tsx`, `app/(reader)/layout.tsx`
- Create: `components/reader/reader-chrome.tsx`, `components/reader/reader-settings-sheet.tsx`, `components/reader/use-chrome-visibility.ts`, `components/reader/next-chapter-card.tsx`
- Delete: `components/reader/reader-settings.tsx`

## Implementation Steps
1. Prefs v2 + migrate từ v1.
2. `useChromeVisibility` (scroll hướng, tap giữa, timer 3s, bỏ qua khi có selection).
3. ReaderChrome top/bottom, overlay `position: fixed`, safe-area.
4. Settings sheet (dialog có focus trap đơn giản: focus nút đầu, Esc đóng, trả focus về "Aa").
5. NextChapterCard cuối bài.
6. Test thủ công dấu tiếng Việt ở 3 mức giãn dòng × 6 cỡ chữ (chụp màn hình 390px).

## Success Criteria
- [ ] Chạm giữa bật/tắt chrome; cuộn ẩn/hiện; chữ không nhảy khi chrome đổi
- [ ] Giãn dòng đổi ngay, nhớ sau reload; prefs cũ không mất
- [ ] Không cắt dấu ở "ệ ồ ử ặ ẫ ậ" mức Hẹp + cỡ lớn nhất
- [ ] Lưu tiến độ vẫn chạy (không đụng `use-progress-sync`)

## Risk Assessment
- Tap giữa xung đột bôi chọn chữ/nhấn link → bỏ qua khi `getSelection()` không rỗng hoặc target là `a/button`.
- iOS: `position: fixed` + bàn phím không liên quan (reader không có input).
