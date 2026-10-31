---
phase: 3
title: "Khung app: sidebar, thanh trên, công tắc theme"
status: completed
priority: P1
effort: "3h"
dependencies: [1]
---

# Phase 3: Khung app

## Overview
Thay header + thanh nav slate bằng sidebar trái và thanh trên theo mockup (≥1024px); header gọn + tab bar (<1024px). Áp dụng cho mọi trang trong `(site)`.

## Requirements
- Functional:
  - **Sidebar ≥1024px** (~180px, dính đầu trang, cao hết màn hình): logo + "Truyện" → `/`; 5 mục có icon Trang chủ · Thể loại · Mới cập nhật · Truyện full · Tủ truyện (active: pill `bg-accent-soft`, chữ + icon `text-accent-fg`); mèo trang trí; công tắc Sáng/Tối; bánh răng → `/toi`.
  - **Thanh trên ≥1024px:** ô tìm dạng pill bên trái; bên phải nút tên + ảnh → `/toi`.
  - **<1024px:** header gọn (logo, nút tìm, ảnh → `/toi`), tab bar 4 mục giữ nguyên chức năng.
  - Chưa đăng nhập (`/dang-nhap`): không sidebar, không tab bar, không nút người dùng (như hiện tại).
  - Không vào `(reader)`.
- Non-functional: chạm ≥44px, safe-area như cũ, mọi control có nhãn; sidebar cuộn được khi màn thấp.

## Architecture
- `(site)/layout.tsx`: `flex` ngang → `<Sidebar/>` + cột phải (`<Header/>`, nội dung, `<TabBar/>`).
- `chrome/sidebar.tsx` (server, đọc `getAuthorizedUser`; null thì không render). `NavLink` đổi kiểu cho sidebar, có icon. Thêm icon Flame + Star vào `nav-items.tsx`; `DESKTOP_NAV` thành danh sách có `Icon`.
- `chrome/theme-toggle.tsx` (client): `useTheme` + `resolvedTheme`, `setTheme(light|dark)`; dùng mẫu `useSyncExternalStore` như `theme-picker.tsx` để không lệch hydrate; là `button` có `aria-pressed`, nhãn "Giao diện tối", icon mặt trời. `theme-picker.tsx` ở trang Tôi giữ nguyên.
- `chrome/header.tsx` viết lại; `search-form.tsx` đổi thành pill (`bg-surface`, viền `line`, không nút xanh trên desktop — Enter để tìm, vẫn có nút cho mobile/trang tìm kiếm qua prop).
- Avatar: `user.image` của Google, `next/image` `unoptimized` + `referrerPolicy="no-referrer"`; thiếu ảnh → chữ cái đầu trên `bg-accent-soft`. Tách `chrome/user-avatar.tsx`, dùng chung header + trang Tôi về sau.
- Bỏ: thanh nav slate trong `header.tsx`; `auth-slot.tsx` gộp vào header nếu không còn chỗ dùng.

## Related Code Files
- Create: `apps/web/src/components/chrome/{sidebar,theme-toggle,user-avatar}.tsx`
- Modify: `apps/web/src/app/(site)/layout.tsx`, `apps/web/src/components/chrome/{header,nav-items,nav-link,search-form,tab-bar}.tsx`
- Delete: `apps/web/src/components/chrome/auth-slot.tsx` (nếu mồ côi)

## Implementation Steps
1. Sidebar + `NavLink` + icon; đổi layout `(site)`.
2. `ThemeToggle`; đặt vào sidebar. Mobile đổi theme vẫn ở trang Tôi.
3. Header 2 biến thể + avatar; `SearchForm` pill.
4. Kiểm `/dang-nhap` không có khung; trang truyện, tủ truyện vẫn đúng chỗ với cột hẹp hơn 180px.
5. Chụp 390 + 1440, sáng + tối.

## Success Criteria
- [x] Desktop có sidebar + thanh trên; mobile có header + tab bar; không chồng nội dung
- [x] Công tắc đổi theme, không nhấp nháy/lệch hydrate
- [x] Viền focus thấy rõ trong sidebar; không còn `bg-bar` trong chrome trang web

## Risk Assessment
- Cột nội dung hẹp đi 180px làm lưới trang cũ (max 1200px) sát biên ở 1024–1280px → kiểm ảnh chụp 1280.
- Ảnh Google lỗi/hết hạn → `onError` không có trong server component; để phần nền chữ cái nằm dưới ảnh.
- Mobile không có công tắc: đúng thiết kế (trang Tôi đã có).
