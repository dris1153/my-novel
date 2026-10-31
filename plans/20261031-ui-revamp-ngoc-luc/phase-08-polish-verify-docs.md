---
phase: 8
title: "Hoàn thiện + kiểm tra + docs"
status: completed
priority: P2
effort: "3h"
dependencies: [4, 5, 6, 7]
---

# Phase 8: Hoàn thiện + kiểm tra + docs

## Overview
Rà toàn app ở 390/1440 × light/dark, dọn sót, chạy đủ kiểm tra, viết lại `DESIGN.md` + mục gotcha trong `AGENTS.md`, review code, mở PR.

## Requirements
- Không còn dấu vết hệ cũ: grep `ink-art|InkArt|ink-to-mask|f2b25c|Noto_Serif|font-serif|tint-card|tint-hero|Thư viện đêm|WelcomeBanner|NextChapterCard` trong `apps/web` → rỗng (trừ lịch sử trong `plans/`).
- Màn 390px: không cuộn ngang; chạm ≥44px; tab bar + safe-area; carousel vuốt được.
- Kiểm tra: `pnpm typecheck`, `pnpm test`, `pnpm --filter web lint`, `pnpm --filter web build` xanh.

## Architecture
- Chụp bằng `shot.mjs` (scratchpad, `JWT` + `BASE`, dev `next dev --webpack`): trang chủ, danh sách, thể loại, tìm kiếm, trang truyện, mục lục, tủ truyện, Tôi, reader (4 nền), sign-in (chưa đăng nhập), 404, lỗi — ở light + dark.
- So với ảnh tham chiếu TruyenYY (`scratchpad/ref/truyenyy/`) về cấu trúc, không so pixel.

## Related Code Files
- Modify: `DESIGN.md` (viết lại: "Ngọc Lục" — token, font, layout từng trang, art, quy tắc màu: xanh làm chữ luôn `accent-fg`, đỏ chỉ cho số chương, slate chỉ cho nav/thanh reader), `AGENTS.md` (dòng gotcha màu: `accent-fg` xanh đậm; dòng `art/`: ảnh màu, không còn mask; thêm: art/ảnh trước đăng nhập phải `unoptimized`), `README.md` nếu nhắc hệ cũ, `docs/huong-dan-su-dung.md` nếu nhắc theme tối mặc định/thủy mặc
- Modify: `plans/20261031-ui-revamp-ngoc-luc/plan.md` (trạng thái phase)

## Implementation Steps
1. Grep dọn sót; chạy 4 lệnh kiểm tra.
2. Chụp toàn bộ, sửa lỗi bố cục.
3. `code-reviewer` subagent review diff; sửa phát hiện đáng kể.
4. Viết lại `DESIGN.md`, cập nhật `AGENTS.md`/docs.
5. Commit theo phase (conventional, không nhắc AI), push `feat/ui-ngoc-luc`, mở PR — hỏi user trước khi push/mở PR.

## Success Criteria
- [ ] Tất cả success criteria trong `plan.md` đạt
- [ ] `DESIGN.md` khớp code (token trong file = token trong `globals.css`)

## Risk Assessment
- Build Vercel khác máy local (font Google tải lúc build) → `pnpm --filter web build` local trước khi push.
- PR lớn khó review → commit tách theo phase.
