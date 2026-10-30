---
phase: 7
title: "Deploy Vercel + verify"
status: pending
priority: P1
effort: "2h"
dependencies: [6]
---

# Phase 7: Deploy Vercel + verify

## Overview
Đưa `apps/web` lên Vercel với env mới và kiểm tra end-to-end bằng tài khoản whitelist thật.

## Requirements
- Functional: toàn bộ success criteria của plan.md đạt trên URL Vercel.
- Non-functional: không secret nào trong repo code; env chỉ ở Vercel.

## Implementation Steps
1. Vercel project: Root Directory `apps/web`, pnpm, Node 22; bật "include files outside root" (cần `packages/shared`).
2. Env production: `GITHUB_DATA_REPO`, `GITHUB_DATA_TOKEN`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `ALLOWED_EMAILS`, `AUTH_URL`/trust host nếu cần.
3. Thêm redirect URI Vercel vào Google OAuth client.
4. Smoke test (checklist):
   - [ ] Chưa đăng nhập → bị gate ở `/`, `/truyen/<slug>`, `/api/cover/<slug>`, `/api/progress`
   - [ ] Email ngoài whitelist bị từ chối
   - [ ] Đọc 1 truyện dài: mục lục phân trang, đọc chương, phím tắt
   - [ ] ♡ + đọc dở ở máy A → máy B thấy "Đọc tiếp" đúng
   - [ ] `pnpm crawl` 1 truyện mới (`--limit 20`) → ≤10 phút xuất hiện trên web
   - [ ] Log Vercel không có lỗi 403/429 từ GitHub; không lộ token trong response/HTML
5. Theo dõi dung lượng repo `novel-data` (`gh api repos/<owner>/novel-data --jq .size`).
6. Xoá project Supabase + bucket R2 (đang trống).

## Success Criteria
- [ ] Toàn bộ checklist trên pass
- [ ] Vercel build xanh từ `main`

## Risk Assessment
- Build Vercel không thấy `packages/shared` → bật include files outside root + `transpilePackages`.
- Cold start + gọi GitHub lần đầu chậm → chấp nhận; cache sẽ ấm sau lần đọc đầu.
