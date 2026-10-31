---
title: "Revamp UI — hệ 'Thư viện đêm' (dark-first, mobile-first)"
status: in-progress
scope: project
created: 2026-10-31
source: plans/reports/brainstorm-20261031-ui-revamp-thu-vien-dem.md
mockups: https://claude.ai/artifact/Lt4FUrNdiHWC2knbS2xpLX
blockedBy: [20261030-github-repo-storage]
blocks: []
supersedes: [20260929-web-reader-opennote]
---

# Revamp UI — "Thư viện đêm"

Thay toàn bộ giao diện Opennote (giấy ngà, sepia, doodle) của `apps/web` bằng hệ dark-first + light,
mobile-first, nhấn hổ phách, màu theo bìa, art thủy mặc AI. Làm trên branch mới từ `main`
**sau khi PR #2 (github-storage) đã merge**.

Research: `plans/reports/researcher-20261030-{novel-platform-ui-patterns,reader-visual-language,ai-illustration-direction}.md`.

## Quyết định đã chốt

| Hạng mục | Chốt |
|---|---|
| Theme | Dark mặc định (`#111113`), light (Radix slate light), Tôi → Tự động/Sáng/Tối |
| Nhấn | `#F2B25C` (fill, chữ tối `#1a1206`); chữ/link nhấn ở light ≈ `#8a5200` |
| Font | Be Vietnam Pro (UI) · Noto Serif 600/700 (tiêu đề) · Literata (thân truyện, chỉ reader) |
| Điều hướng | Tab bar dưới 4 mục <1024px; nav trên header ≥1024px; tìm kiếm ở header |
| Màu theo bìa | `coverColor` tính lúc crawl (sharp), gradient header chi tiết + thẻ Đang đọc |
| Art | 7 ảnh thủy mặc đơn sắc (Gemini 3 Pro Image) → mask WebP tô bằng CSS var |
| Tủ truyện | Danh sách: tiến độ "Chương X / Y" + badge "+N chương mới" (`state.seen`) |
| Reader | Chrome nổi (chạm giữa / cuộn), vạch tiến độ 2px, bottom sheet + giãn dòng |
| Bỏ | Doodle, token sepia/violet/forest/oxblood/margin, panel violet, footer |

## Phases

| # | Phase | Trạng thái | Phụ thuộc |
|---|-------|-----------|-----------|
| 1 | [Nền tảng: token, font, theme, primitive](phase-01-foundation-tokens-fonts.md) | done | — |
| 2 | [Khung app: header, tab bar, trang Tôi](phase-02-app-shell-navigation.md) | done | 1 |
| 3 | [Dữ liệu: coverColor + state.seen](phase-03-data-cover-color-seen.md) | done | — |
| 4 | [Khám phá: trang chủ, thể loại, tìm kiếm](phase-04-discovery-pages.md) | done | 2, 3 |
| 5 | [Chi tiết truyện + mục lục](phase-05-novel-detail-toc.md) | done | 2, 3 |
| 6 | [Tủ truyện](phase-06-library.md) | done | 2, 3 |
| 7 | [Trình đọc](phase-07-reader.md) | done | 1 |
| 8 | [Art thủy mặc AI](phase-08-ink-wash-art.md) | blocked (key Gemini free-tier) — đã có placeholder | 1 |
| 9 | [Hoàn thiện + kiểm tra + docs](phase-09-polish-verify-docs.md) | done | 4–8 |

Song song được: 1 ∥ 3; sau 1: 7 ∥ 8; sau 2+3: 4 ∥ 5 ∥ 6 (file khác nhau).

## Success criteria

- [ ] Không còn token/doodle Opennote; `DESIGN.md` mô tả hệ mới
- [ ] 390px: không cuộn ngang, chạm ≥44px, tab bar tôn trọng safe-area
- [ ] Mọi cặp chữ/nền ≥4.5:1 ở cả dark và light (test tự động)
- [ ] Reader: bật/tắt chrome, bottom sheet, giãn dòng; dấu tiếng Việt chồng không bị cắt
- [ ] Tủ truyện hiện tiến độ + "+N" đúng
- [ ] `pnpm typecheck`, `pnpm test`, `pnpm --filter web lint`, `pnpm --filter web build` xanh

## Rủi ro chính

| Rủi ro | Giảm thiểu |
|---|---|
| Phạm vi chạm gần mọi component | Chia phase theo nhóm trang; primitive dùng chung trước |
| Tương phản nhấn ở light | Test contrast đọc token từ `globals.css` |
| Ảnh AI lệch tông, không có seed | 1 ảnh mẫu style + checklist; không đạt → giữ placeholder |
| `seen` sinh thêm commit | Ghi kèm lần ghi tiến độ/theo dõi sẵn có, không thêm lần ghi riêng |
| Turbopack dev lỗi `next/font/google` trên máy này | Dev bằng `next dev --webpack` |
