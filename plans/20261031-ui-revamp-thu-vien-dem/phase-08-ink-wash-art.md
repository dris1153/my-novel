---
phase: 8
title: "Art thủy mặc AI"
status: blocked
priority: P2
effort: "4h"
dependencies: [1]
---

# Phase 8: Art thủy mặc AI

## Overview
Sinh 7 ảnh thủy mặc đơn sắc, chuyển thành mask WebP alpha, hiển thị bằng CSS mask tô màu theo theme. Làm lại trang đăng nhập + nối art vào empty state/404/lỗi/banner trang chủ.

## Requirements
- Functional: ảnh cho sign-in hero (4:5), home banner (16:9), empty-library, no-results, no-chapters, 404, error (1:1). Trang `/dang-nhap` mới: art trên, tiêu đề serif, nút Google, thông báo bị từ chối. `not-found.tsx` + `error.tsx` cho `(site)`.
- Non-functional: một file dùng cho cả dark/light; dung lượng: hero ≤100 KB, empty ≤15 KB; không lazy-load ảnh LCP.

## Architecture
- Model: `gemini-3-pro-image` (final), `gemini-nano-banana-2.1` (thử prompt). Imagen 4 đã dừng. Cần `GEMINI_API_KEY` — kiểm trước; không có → dừng phase, giữ placeholder SVG và báo user.
- Quy trình (chi tiết + prompt: `plans/reports/researcher-20261030-ai-illustration-direction.md`):
  1. Sinh 1 ảnh neo style (sign-in hero), user duyệt.
  2. Mỗi ảnh còn lại = SUBJECT + COMPOSITION + STYLE block nguyên văn, đính ảnh neo làm style reference.
  3. Checklist duyệt từng ảnh (không chữ/ấn/mặt người, ≥60% trống, nhận ra ở 160px…).
- Chuyển đổi tất định: `apps/web/scripts/ink-to-mask.mjs` (sharp, đã có trong workspace): levels → alpha = 255 − luminance, RGB đen → WebP alpha. Commit script + ảnh gốc PNG? → **không** commit PNG gốc (nặng); commit WebP + `public/art/PROMPTS.md` (prompt, model, ngày).
- Hiển thị: `components/ui/ink-art.tsx` → `<div role="img" aria-label=… style="mask-image:url(/art/x.webp)">` với `background-color: var(--ink-art)`, opacity ~0.9 dark / 0.75 light. Ảnh nằm trong `public/art/` → **phải miễn gate**: thêm `/art/` vào matcher loại trừ trong `proxy.ts` (đường dẫn tĩnh cố định, không phải theo đuôi file) và cập nhật `gate.test.ts`.

## Related Code Files
- Create: `apps/web/public/art/*.webp`, `apps/web/public/art/PROMPTS.md`, `apps/web/scripts/ink-to-mask.mjs`, `components/ui/ink-art.tsx`, `app/(site)/not-found.tsx`, `app/(site)/error.tsx`
- Modify: `app/(site)/dang-nhap/page.tsx`, `components/ui/empty-state.tsx`, `app/(site)/page.tsx` (banner), `src/proxy.ts` (miễn `/art/`), `src/lib/gate.test.ts`
- Delete: `components/doodles/index.tsx` (khi không còn chỗ dùng)

## Implementation Steps
1. Kiểm `GEMINI_API_KEY` + skill `ai-multimodal`/`ai-artist`; thử 1–2 ảnh với nano-banana để xác nhận tỉ lệ khung hỗ trợ.
2. Sinh ảnh neo → **dừng hỏi user duyệt** → sinh 6 ảnh còn lại.
3. Script chuyển mask; kiểm dung lượng.
4. `InkArt` + nối vào sign-in, banner, empty states, 404, error.
5. Miễn gate cho `/art/` (+ test: `/art/x.webp` không gate, `/artx` vẫn gate).

## Success Criteria
- [ ] 7 ảnh qua checklist, user duyệt ảnh neo
- [ ] Hiển thị đúng ở dark và light từ cùng 1 file
- [ ] Trang đăng nhập (chưa đăng nhập) hiện được art
- [ ] Không còn import `doodles`

## Risk Assessment
- Ảnh lệch tông/nhiễu → sinh lại tối đa ~6 lần/ảnh; vẫn hỏng → giữ placeholder cho ảnh đó.
- Miễn gate sai có thể mở lỗ → chỉ miễn tiền tố `/art/` cố định, test bảo vệ.
- Chi phí ~$5–13; dừng nếu vượt ~$20.
