---
phase: 5
title: "Kiểm tra, docs, dừng duyệt"
status: in-progress
priority: P1
effort: "1.5h"
dependencies: [4]
---

# Phase 5: Kiểm tra, docs, dừng duyệt

## Overview
Chạy đủ kiểm tra, rà các trang chưa làm có vỡ không, review code, cập nhật docs, rồi **dừng gửi user ảnh chụp để duyệt**. Không tự làm trang tiếp theo.

## Requirements
- `pnpm typecheck`, `pnpm test`, `pnpm --filter web lint`, `pnpm --filter web build` xanh.
- Chụp sáng + tối, 390 + 1440: trang chủ; 1440 + 390 sáng: thể loại, danh sách, tìm kiếm, trang truyện, mục lục, tủ truyện, Tôi, reader, đăng nhập, 404 — chỉ để bắt vỡ layout, không chỉnh đẹp.
- `DESIGN.md`: mô tả hệ Mây Tím, ghi rõ trang nào đã revamp, trang nào chỉ nhận màu mới. `AGENTS.md`: dòng tham chiếu design + gotcha màu (không còn slate, tint). `docs/huong-dan-su-dung.md`: bảng trang chủ.

## Architecture
- Dev: `next dev --webpack`. Server trên cổng 3000 có thể đang chạy sẵn, dùng lại. Script chụp + mint session ở scratchpad (`shot.mjs`, `mint-jwt.mjs`, cần `uid` trong token); scratchpad có thể đã mất ở phiên sau, khi đó viết lại.
- Nếu đổi branch khi dev server đang chạy, xoá `apps/web/.next/types` + `.next/dev/types` rồi `next typegen` (route types cũ gây lỗi typecheck giả).

## Related Code Files
- Modify: `DESIGN.md`, `AGENTS.md`, `docs/huong-dan-su-dung.md`, `plans/20261031-ui-may-tim/plan.md`

## Implementation Steps
1. 4 lệnh kiểm tra; grep leftovers (`shortcut`, `GenrePanel`, `LatestList`, `ContinueReading`, `banner-`, `font-be-vietnam`).
2. Chụp toàn bộ; sửa vỡ layout (không chỉnh thẩm mỹ các trang ngoài phạm vi).
3. `code-reviewer` review diff so với `origin/main`; sửa phát hiện High/Medium.
4. Cập nhật docs + trạng thái plan.
5. Commit theo phần (art, code, docs; conventional, không nhắc AI). **Hỏi trước khi push/mở PR.**
6. Gửi user ảnh chụp trang chủ; nêu rõ đang có bao nhiêu truyện và nhắc crawl thêm nếu còn thưa. Chờ duyệt rồi mở vòng cho các trang sau.

## Success Criteria
- [ ] Kiểm tra xanh, review không còn High
- [ ] Không trang nào vỡ layout
- [ ] User đã xem ảnh chụp trang chủ

## Risk Assessment
- Đánh giá sai vì thư viện 2 truyện → nói rõ khi gửi ảnh.
- `fix/crawler-integrity` chưa push: không liên quan branch này, nhắc user quyết riêng.
