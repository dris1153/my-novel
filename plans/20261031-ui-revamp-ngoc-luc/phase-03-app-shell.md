---
phase: 3
title: "Khung app: header, nav slate, tab bar"
status: completed
priority: P1
effort: "3h"
dependencies: [1]
---

# Phase 3: Khung app

## Overview
Header trắng kiểu TruyenYY: mobile gọn (wordmark + nút tìm), desktop có ô tìm kiếm + thanh nav slate bên dưới. Tab bar dưới giữ chức năng, đổi kiểu, hiện cả ở trang truyện.

## Requirements
- Functional:
  - <1024px: header `bg-surface` cao 56px: wordmark "Truyện" (`font-heading`, `text-accent-fg`) + nút tìm (→ `/tim-kiem`) + AuthSlot.
  - ≥1024px: hàng 1 trắng: wordmark, form tìm kiếm (`GET /tim-kiem?q=`, input `bg-subtle` + nút `bg-accent` "Tìm"), AuthSlot. Hàng 2 `bg-bar text-on-bar`: Trang chủ · Thể loại · Mới cập nhật · Truyện full · Tủ truyện; mục active nền `bg-accent text-on-accent` (hoặc gạch dưới accent).
  - Tab bar: 4 mục cũ, `bg-surface` + `border-line`, active `text-accent-fg` + icon đậm; bỏ điều kiện ẩn ở `/truyen/[slug]` (thanh ghim đáy bị bỏ ở phase 5), vẫn ẩn ở `/dang-nhap`.
- Non-functional: chạm ≥44px; safe-area như cũ; header sticky nhưng chỉ hàng 1 (thanh slate cuộn theo trang) để không chiếm chỗ.

## Architecture
- `nav-items.tsx`: giữ `NAV` (tab bar); thêm `DESKTOP_NAV` (5 mục, không icon). `isActive` dùng chung; `/danh-sach/...` khớp theo href đầy đủ.
- `header.tsx` (server) render 2 hàng; thanh slate là `<nav>` thứ hai chỉ `lg:block`. Ô tìm là `<form action="/tim-kiem">` thuần — không cần client JS. Giữ một `aria-label` khác nhau cho 2 `<nav>` ("Điều hướng chính" / "Danh mục").
- `NavLink` (client, đọc pathname) đổi kiểu cho nền slate.
- Không thêm footer (ngoài phạm vi).

## Related Code Files
- Modify: `components/chrome/{header,nav-items,nav-link,tab-bar,auth-slot}.tsx`, `app/(site)/layout.tsx` (padding đáy cho tab bar giữ nguyên)

## Implementation Steps
1. `DESKTOP_NAV` + kiểu `NavLink` trên nền `bar`.
2. Viết lại `Header`: hàng trắng + form tìm (desktop) / nút tìm (mobile) + thanh slate desktop.
3. Tab bar: bỏ regex `/truyen/[slug]` khỏi `hidden()`, sửa comment; đổi nền/active.
4. Chụp 390 + 1440 (script `shot.mjs` trong scratchpad, `JWT` + `BASE`) — header, tab bar, nav active.

## Success Criteria
- [ ] Desktop: 2 hàng; tìm kiếm submit ra `/tim-kiem?q=…`
- [ ] Mobile: tab bar hiện ở trang truyện; không chồng nội dung (padding đáy)
- [ ] Focus ring thấy rõ trên nền slate (`--focus-ring` = `on-bar` trong thanh slate)

## Risk Assessment
- Focus ring `accent-fg` (#166534) trên slate #2F3640 chỉ ~1.5:1 → đặt `--focus-ring: var(--on-bar)` cho thanh slate.
- Desktop nav trỏ tới `/danh-sach/*` trước khi phase 4 xong → 404 tạm thời trên branch; chấp nhận (không merge giữa chừng).
