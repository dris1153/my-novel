---
title: "Revamp UI — hệ 'Ngọc Lục' (layout TruyenYY, nhấn xanh lục, light-first)"
status: completed
scope: project
created: 2026-10-31
source: plans/reports/brainstorm-20261031-ui-revamp-ngoc-luc.md
blockedBy: []
blocks: []
supersedes: [20261031-ui-revamp-thu-vien-dem]
---

# Revamp UI — "Ngọc Lục"

Đổi lớp giao diện "Thư viện đêm" (dark, hổ phách, thủy mặc) của `apps/web` sang layout + cách dùng màu
của truyenyy.co, primary xanh lục, light-first, art donghua màu (Meshy). Dữ liệu, state, cơ chế reader giữ nguyên.
Branch `feat/ui-ngoc-luc` từ `main`.

Thiết kế chi tiết + tham chiếu TruyenYY: `plans/reports/brainstorm-20261031-ui-revamp-ngoc-luc.md`.

## Quyết định đã chốt

| Hạng mục | Chốt |
|---|---|
| Theme | Light mặc định (nền trang `#F0F2F5`, khối trắng); dark tuỳ chọn ở Tôi |
| Nhấn | Fill `#15803D` + chữ trắng; chữ/link `#166534`; dark `#22C55E` / `#4ADE80` |
| Màu phụ | `hot-fg` đỏ chỉ cho số chương; `bar` slate cho nav desktop + thanh trên reader |
| Font | Roboto Condensed (tiêu đề, nav) · Be Vietnam Pro (thân) · Literata (reader). Bỏ Noto Serif |
| Điều hướng | Tab bar dưới (<1024px, hiện cả ở trang truyện); desktop: header trắng + thanh nav slate |
| Trang chủ | Carousel banner AI → ô tìm → Đọc tiếp → 6 lối tắt → kệ 4 cột "Thêm →" |
| Danh sách | Trang mới `/danh-sach/moi-cap-nhat`, `/danh-sach/hoan-thanh` (+ phân trang) |
| Art | Meshy `gpt-image-2-5-sunburst`: 4 banner, sign-in, 5 spot (nền trong) — trần 170 credit |
| Icon | Fluent Emoji 3D (MIT) cho 6 lối tắt |
| Bỏ | Mask thủy mặc + `ink-to-mask.mjs`, tint màu bìa, thanh hành động ghim đáy, WelcomeBanner, lưới "Tất cả truyện" |

## Phases

| # | Phase | Trạng thái | Phụ thuộc |
|---|-------|-----------|-----------|
| 1 | [Nền tảng: token, font, theme, primitive](phase-01-foundation-tokens-fonts.md) | done | — |
| 2 | [Art Meshy + icon lối tắt](phase-02-art-meshy-icons.md) | done | — |
| 3 | [Khung app: header, nav slate, tab bar](phase-03-app-shell.md) | done | 1 |
| 4 | [Trang chủ + trang danh sách](phase-04-home-and-lists.md) | done | 2, 3 |
| 5 | [Trang truyện + mục lục](phase-05-novel-detail-toc.md) | done | 3 |
| 6 | [Thể loại, tìm kiếm, tủ truyện, Tôi, sign-in, trang trống/lỗi](phase-06-other-pages.md) | done | 2, 3 |
| 7 | [Trình đọc](phase-07-reader.md) | done | 1 |
| 8 | [Hoàn thiện + kiểm tra + docs](phase-08-polish-verify-docs.md) | done | 4–7 |

Song song được: 1 ∥ 2; sau 1: 3 ∥ 7; sau 3: 5, rồi 4 ∥ 6 khi có art (khác file).

## Success criteria

- [x] Ảnh chụp 390px + 1440px của trang chủ, trang truyện, reader theo đúng cấu trúc trong báo cáo
- [x] grep `ink-art`, `f2b25c`, `Noto_Serif`, `tint-card`, `font-serif` → không còn
- [x] Mọi cặp chữ/nền ≥4.5:1 ở light + dark (`contrast.test.ts` đọc `globals.css`)
- [x] 390px không cuộn ngang, chạm ≥44px (trừ chấm carousel 24px); carousel vuốt + bàn phím được, reduced-motion tắt tự chạy
- [x] Art + icon đủ, tổng 804 KB; Meshy tiêu 114 credit
- [x] `pnpm typecheck`, `pnpm test`, `pnpm --filter web lint`, `pnpm --filter web build` xanh

## Lệch so với plan khi làm

- Bỏ khối "Chọn lọc" trên trang chủ desktop: trùng carousel (cùng lấy truyện `featured`); danh sách "Mới cập nhật" chiếm hết hàng.
- Nền đọc mặc định đổi Đêm → Giấy cho hợp light-first (prefs đã lưu không bị ghi đè).
- Banner 3–4 ~130 KB (mục tiêu 120 KB) — chỉ banner đầu tải ngay.
- `iconOnly` của LikeButton/FollowButton bị gỡ vì không còn nơi dùng.

## Rủi ro chính

| Rủi ro | Giảm thiểu |
|---|---|
| Đảo vai `surface`: light giờ trắng trên nền xám → chip/skeleton `bg-surface` trong khối trắng biến mất | Phase 1 rà 12 chỗ `bg-surface`, đổi fill trong khối sang `bg-subtle` |
| Xanh `#15803D` làm chữ trên nền xám chỉ 4.47:1 | Chữ luôn `accent-fg`; test bắt |
| `next/image` tối ưu qua `/_next/image` bị gate chặn trước đăng nhập | Art dùng `unoptimized` (như bìa) |
| Meshy lỗi/timeout có thể vẫn trừ credit | Kiểm `meshy_list_tasks` trước khi tạo lại; dừng ở 170 |
| Ảnh AI lệch tông | 2 mẫu → user chọn neo → các ảnh sau dùng neo làm tham chiếu |
| Turbopack dev lỗi `next/font/google` trên máy này | `next dev --webpack` |
