---
phase: 2
title: "Khung app: header, tab bar, trang Tôi"
status: completed
priority: P1
effort: "3h"
dependencies: [1]
---

# Phase 2: Khung app — header, tab bar, trang Tôi

## Overview
Điều hướng kiểu app: tab bar dưới trên điện thoại, nav trên header ở desktop. Trang Tôi có công tắc giao diện. Bỏ footer.

## Requirements
- Functional: 4 tab Trang chủ `/` · Thể loại `/the-loai` · Tủ truyện `/tu-truyen` · Tôi `/toi`, tab đang ở được đánh dấu (màu nhấn + đậm + `aria-current`); header có wordmark + nút tìm kiếm (→ `/tim-kiem`); Tôi: tên, email, chọn Tự động/Sáng/Tối, đăng xuất.
- Non-functional: tab bar cố định đáy, `padding-bottom: env(safe-area-inset-bottom)`, nội dung chừa chỗ (`pb` ≈ 72px + safe-area); vùng chạm ≥44px; ẩn tab bar ≥1024px.

## Architecture
```
(site)/layout.tsx
  <Header/>        wordmark "Truyện" (Noto Serif) · [≥lg: nav ngang 4 mục] · nút tìm kiếm · [≥lg: AuthSlot]
  <main className="pb-[calc(72px+env(safe-area-inset-bottom))] lg:pb-16">{children}</main>
  <TabBar/>        lg:hidden, client component dùng usePathname() để đánh dấu tab
```
- Đánh dấu tab theo tiền tố: `/truyen/*` không thuộc tab nào; `/the-loai/*` → Thể loại.
- Theme picker: client component dùng `useTheme()` của next-themes, 3 nút dạng segmented, `aria-pressed`.
- Trang đăng nhập `/dang-nhap` dùng layout riêng không có tab bar (chưa đăng nhập thì tab vô nghĩa) → tách route group `(auth)` hoặc ẩn tab bar khi pathname = `/dang-nhap`. Chọn: ẩn bằng điều kiện trong TabBar (ít di chuyển file).

## Related Code Files
- Create: `components/chrome/tab-bar.tsx`, `components/chrome/theme-picker.tsx`
- Modify: `app/(site)/layout.tsx`, `components/chrome/header.tsx`, `components/chrome/nav-link.tsx`, `components/chrome/auth-slot.tsx`, `app/(site)/toi/page.tsx`
- Delete: `components/chrome/footer.tsx`, `components/chrome/theme-toggle.tsx` (thay bằng theme-picker ở Tôi)

## Implementation Steps
1. TabBar: grid 4 cột, icon stroke inline SVG 22px + nhãn 11px, nền `bg-bg/95` + viền trên; active = `text-accent-text font-semibold`.
2. Header: cao 56px, sticky trên cùng với nền đặc khi cuộn (không glass sau chữ); desktop thêm nav ngang.
3. Layout `(site)`: bỏ Footer, thêm padding đáy.
4. Trang Tôi: thẻ tài khoản (avatar chữ cái đầu, tên, email), nhóm "Giao diện" (ThemePicker), nút Đăng xuất (ghost, xác nhận không cần).
5. Kiểm 390px và 1280px.

## Success Criteria
- [ ] Điện thoại: tab bar hiện, đúng tab active ở 4 trang + trang con; không che nội dung cuối trang
- [ ] ≥1024px: không tab bar, nav trên header
- [ ] `/dang-nhap` không có tab bar
- [ ] Đổi theme ở Tôi có hiệu lực ngay và giữ sau reload

## Risk Assessment
- iOS Safari thanh địa chỉ co giãn → dùng `env(safe-area-inset-bottom)` và kiểm `viewport-fit=cover` trong metadata viewport.
