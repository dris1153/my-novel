---
phase: 4
title: "Google login + whitelist + gate"
status: in-progress
priority: P1
effort: "4h"
dependencies: [3]
---

# Phase 4: Google login + whitelist + gate

## Overview
Thay Supabase auth bằng Google OAuth stateless (JWT cookie). Chỉ email trong `ALLOWED_EMAILS` được vào; toàn site bị gate.

## Requirements
- Functional: đăng nhập Google; email ngoài whitelist bị từ chối; chưa đăng nhập → redirect `/dang-nhap`; `userId` ổn định theo email.
- Non-functional: không DB; whitelist đổi bằng env (cần redeploy); `email_verified` phải true.

## Architecture
```
proxy.ts ── chưa có session? ──► redirect /dang-nhap   (bỏ qua /api/auth/*, _next, favicon)
Auth.js (Google) ── signIn callback: email_verified && ALLOWED_EMAILS.has(email.toLowerCase())
session.user.id = userIdFromEmail(email)   (hash, dùng làm tên file state)
requireUser() ── mọi page/server action/route handler dữ liệu (proxy KHÔNG phải ranh giới bảo mật duy nhất)
```
Env: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `ALLOWED_EMAILS` (phân tách dấu phẩy).

## Related Code Files
- Create: `apps/web/src/auth.ts` (config Auth.js), `apps/web/src/app/api/auth/[...nextauth]/route.ts`
- Modify: `apps/web/src/proxy.ts` (bỏ Supabase; gate), `apps/web/src/lib/auth.ts` (`requireUser`), `lib/current-user.ts`, `components/chrome/auth-slot.tsx`, `app/(site)/dang-nhap/page.tsx` (nút Google), `app/(site)/toi/page.tsx` (tên + đăng xuất)
- Delete (phase 6): `app/(site)/dang-ky`, `auth-form.tsx`, `profile-form.tsx`, `updateDisplayName`

## Implementation Steps
1. **Spike (≤1h):** `next-auth@beta` (v5) chạy được trên Next 16.3 với `proxy.ts` + Vercel không? Không → fallback `jose` ký JWT + luồng OIDC Google tự viết (authorize URL, callback đổi code, verify id_token) — ghi quyết định vào cuối file này.
2. Tạo OAuth client trên Google Cloud (redirect: `http://localhost:3000/api/auth/callback/google` và URL Vercel).
3. Cấu hình provider + `signIn` callback + `jwt/session` callback gắn `id`.
4. `proxy.ts` gate; `requireUser()` redirect nếu thiếu session; áp vào mọi server action/route.
5. `robots.ts` → `Disallow: /`; thêm `noindex` ở layout.
6. Test: hàm `isAllowed(email, list)` (hoa/thường, khoảng trắng, rỗng → từ chối).

## Success Criteria
- [ ] Email whitelist đăng nhập được, session sống qua refresh
- [ ] Email lạ: bị từ chối, không có cookie session
- [ ] `curl` không cookie tới `/`, `/truyen/...`, `/api/cover/...` → redirect/401, không trả nội dung
- [ ] Tắt JS vẫn bị gate (kiểm ở server)

## Risk Assessment
- Whitelist rỗng/sai cú pháp → mặc định **từ chối tất cả** (fail closed).
- Open redirect ở `callbackUrl` → chỉ cho đường dẫn nội bộ.
- Cookie `Secure`/`SameSite=Lax` (mặc định Auth.js); dev http vẫn chạy.
