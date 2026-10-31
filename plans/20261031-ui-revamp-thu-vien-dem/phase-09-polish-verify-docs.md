---
phase: 9
title: "Hoàn thiện + kiểm tra + docs"
status: completed
priority: P2
effort: "3h"
dependencies: [4, 5, 6, 7, 8]
---

# Phase 9: Hoàn thiện, kiểm tra, docs

## Overview
Dọn tàn dư Opennote, thêm chuyển cảnh nhẹ, kiểm tra toàn bộ ở 390px và 1280px cả hai theme, viết lại DESIGN.md và docs.

## Requirements
- Functional: chuyển cảnh bìa → trang chi tiết bằng View Transitions **nếu** Next 16 hỗ trợ gọn (đọc `node_modules/next/dist/docs` trước; không gọn → bỏ, không tự viết router hack).
- Non-functional: `prefers-reduced-motion` tắt mọi chuyển động; không cuộn ngang ở 390px; contrast test xanh.

## Implementation Steps
1. Grep dọn: `doodles`, token cũ, class không dùng, `lib/seo`-style rác, `margin`/`sepia`/`violet` trong code + CSS.
2. View Transitions (tuỳ điều kiện ở trên).
3. Chụp màn hình 390×844 và 1280×800 cho: trang chủ (có/không đang đọc), thể loại, thể loại con, tìm kiếm (có/không kết quả), chi tiết, mục lục, tủ truyện (2 tab, trống), reader (chrome hiện/ẩn, sheet mở, 4 nền), Tôi, đăng nhập, 404 — dark + light (dùng skill chrome-devtools/agent-browser với session JWT test như các phase trước).
4. Sửa lỗi thấy được; ghi sai khác so với mockup.
5. Viết lại `DESIGN.md` (token, font, radius, component, nguyên tắc: 1 màu nhấn, màu theo bìa, art thủy mặc, quy tắc tương phản). Cập nhật `README.md`/`AGENTS.md` (font dev Turbopack, `/art/` miễn gate, contrast test), `docs/huong-dan-su-dung.md` (tab bar, giãn dòng, theme ở Tôi, badge chương mới).
6. Code review (subagent) + chạy `pnpm typecheck`, `pnpm test`, `pnpm --filter web lint`, `pnpm --filter web build`.

## Success Criteria
- [ ] Toàn bộ success criteria ở `plan.md`
- [ ] Bộ ảnh chụp màn hình lưu trong `plans/20261031-ui-revamp-thu-vien-dem/visuals/`
- [ ] DESIGN.md mới, docs cập nhật

## Risk Assessment
- Chụp màn hình cần trang đã đăng nhập → dùng JWT test như phase 4–5 của plan github-storage, không đăng nhập Google thật.
