---
title: "Revamp UI — hệ 'Mây Tím' (pastel theo mockup): khung app + trang chủ"
status: in-progress
scope: project
created: 2026-10-31
source: plans/reports/brainstorm-20261031-ui-may-tim.md
mockups: plans/20261031-ui-may-tim/reference-mockup.png
blockedBy: []
blocks: []
---

# Revamp UI — "Mây Tím"

Theo mockup của user (`reference-mockup.png`): sidebar trái, thẻ pastel, mèo mascot, art anime pastel.
**Phạm vi plan này: khung app + trang chủ, rồi dừng cho user duyệt ảnh chụp.** Các trang sau là vòng riêng.
Dữ liệu, auth, state, cơ chế reader không đổi. Branch `feat/ui-may-tim` từ `origin/main`.

Thiết kế đầy đủ + bảng token: `plans/reports/brainstorm-20261031-ui-may-tim.md`.

## Quyết định đã chốt

| Hạng mục | Chốt |
|---|---|
| Theme | Sáng mặc định; tối "tím đêm"; công tắc Sáng/Tối trên sidebar, trang Tôi vẫn có Tự động |
| Màu | Pastel lấy từ mockup; giữ tên token cũ, thêm 3 tint + `bar` thành màu nút tối |
| Font | Nunito (UI + heading), Literata (reader); bỏ Be Vietnam Pro, Roboto Condensed |
| Điều hướng | Sidebar ≥1024px; header gọn + tab bar <1024px |
| Trang chủ | Banner 3 slide khẩu hiệu · Đang đọc · Tủ truyện · Mới cập nhật · thẻ trang trí · Tiếp tục đọc · Gợi ý |
| Art | Meshy `gpt-image-2-5-sunburst`, 7 ảnh, trần 120 credit; **dừng duyệt sau 2 ảnh mẫu** |
| Bỏ | Thanh nav slate, lưới lối tắt + icon Fluent, cột thể loại, LatestList, banner Ngọc Lục |

## Phases

| # | Phase | Trạng thái | Phụ thuộc |
|---|-------|-----------|-----------|
| 1 | [Nền tảng: token, font, bo góc](phase-01-foundation-tokens-font.md) | done | — |
| 2 | [Art Meshy](phase-02-art-meshy.md) | done | — |
| 3 | [Khung app: sidebar, thanh trên, công tắc theme](phase-03-app-shell.md) | done | 1 |
| 4 | [Trang chủ](phase-04-home.md) | done | 2, 3 |
| 5 | [Kiểm tra, docs, dừng duyệt](phase-05-verify-review.md) | chờ user duyệt | 4 |

Song song được: 1 ∥ 2. Hai điểm dừng chờ user: sau 2 ảnh mẫu (phase 2), sau ảnh chụp trang chủ (phase 5).

## Success criteria

- [ ] Trang chủ 1440px khớp cấu trúc mockup; 390px đúng thứ tự trong báo cáo; cả sáng và tối
- [ ] `contrast.test.ts` có 3 tint và xanh; không raw hex ngoài lớp phủ tranh
- [ ] 390px không cuộn ngang, chạm ≥44px (trừ chấm banner 24px); banner dùng được bằng phím, reduced-motion tắt tự chạy
- [ ] Các trang chưa làm vẫn chạy, không vỡ layout
- [ ] `pnpm typecheck`, `pnpm test`, `pnpm --filter web lint`, `pnpm --filter web build` xanh; Meshy ≤120 credit

## Rủi ro chính

| Rủi ro | Giảm thiểu |
|---|---|
| Thư viện chỉ 2 truyện → trang chủ thưa, Gợi ý trống | Layout tự co khi khối ẩn; nhắc user crawl thêm 6–8 truyện trước khi đánh giá |
| Bìa thật không đồng tông như mockup, có chữ sẵn | Lớp phủ đáy đủ đậm dưới tên; nói rõ giới hạn, không sinh bìa AI |
| Radius/font mới làm trang cũ lệch | Chấp nhận tới vòng của trang đó; chụp kiểm không vỡ ở phase 5 |
| Mascot không đồng nhất giữa các ảnh | Dùng ảnh mẫu đã duyệt làm tham chiếu; kiểm trên nền sáng + tối |
| Lẫn commit crawler (`fix/crawler-integrity` chưa push) | Tạo branch từ `origin/main`, không từ branch đang đứng |
