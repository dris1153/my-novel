---
phase: 8
title: "Auth + Tủ truyện + Tôi"
status: done
priority: P1
effort: "1d"
dependencies: [3]
---

# Phase 8: Auth + Tủ truyện + Tôi

## Overview

Email/password với `@supabase/ssr` (cookie). Đăng ký public. Tủ truyện + hồ sơ + đăng xuất.
Gating: trang cần đăng nhập thì redirect `/dang-nhap`.

## Related Code Files

- Create: `apps/web/src/lib/supabase/{client,server}.ts`
- Create: `apps/web/src/proxy.ts` (refresh session — tên middleware của Next 16)
- Create: `apps/web/src/app/dang-nhap/page.tsx`, `dang-ky/page.tsx`
- Create: `apps/web/src/app/tu-truyen/page.tsx`, `toi/page.tsx`
- Create: `apps/web/src/lib/actions.ts` (signIn, signUp, signOut, saveProgress, toggleLibrary)

## Steps

1. Supabase client/server copy từ admin (`@supabase/ssr`).
2. `proxy.ts` refresh session; giữ route public tĩnh (không đọc cookie ở public pages).
3. `/dang-ky` public: email + password + display_name.
4. `/dang-nhap`: email + password.
5. `/tu-truyen`: `fetchLibrary`, rỗng thì có doodle + CTA.
6. `/toi`: hiển thị hồ sơ, đổi display_name, đăng xuất.
7. Redirect khi chưa đăng nhập truy cập `/tu-truyen`, `/toi`.

## Success Criteria

- [x] Đăng ký → đăng nhập → cookie session sống qua reload
- [x] Tủ truyện thêm/xoá hoạt động
- [x] Trang auth `noindex`; public pages vẫn cache được
