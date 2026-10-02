---
title: "Reader web mới (apps/web) theo Opennote"
status: in-progress
scope: project
created: 2026-09-29
source: plans/reports/brainstorm-20260929-web-reader.md
demo: docs/wireframe/opennote.html
blockedBy: []
blocks: []
---

# Reader web mới `apps/web` theo Opennote

Thêm **app web mới** (`apps/web`, Next.js 16 App Router + Tailwind v4) làm mặt tiền đọc
truyện public. `apps/mobile` và `apps/admin` giữ nguyên (trừ 1 checkbox nhỏ ở admin).
Web giải hẳn hạn chế SEO mà Expo static export mắc phải (xem README), đồng thời cho
phép dùng thẳng motion CSS của skill `transitions-dev`.

## Quyết định đã chốt

| Hạng mục | Chốt |
|---|---|
| App | Mới: `apps/web` — Next 16 App Router + Tailwind v4, SSR/ISR thật |
| Mobile | Giữ nguyên, không sửa |
| Auth | Email/password, `@supabase/ssr` (cookie), đăng ký **public** |
| DB | Supabase (anon + RLS như mobile/admin) |
| Theme | Light theo đúng DESIGN.md + dark chrome suy ra từ DESIGN.md |
| Doodle | SVG nét tay theo DESIGN.md |
| Ratings | Không; dùng `view_count` |
| Motion | CSS transitions của skill `transitions-dev` (`.opencode/skills/`) |
| Reader body | Literata @1.8 (quy ước chữ Việt); chrome Source Serif 4 + Inter |
| Deploy | Vercel → ISR + `next/image` + `images.remotePatterns` cho R2 |
| Token | Mỗi app tự khai báo; `apps/web` theo **đúng DESIGN.md**, không kế thừa tên class của admin |

## Nguyên tắc

Một CTA sepia/viewport. Ink-violet #242d64 = một panel/trang. Forest #0c3b1a = tag/thể loại.
10px radius duy nhất, hairline #e5e5e5, **zero shadow**. Serif (Source Serif 4) cho tiêu đề,
Inter cho UI/body, Literata cho thân truyện. Margin-yellow #ffc934 chỉ làm wash sau doodle.

## Ngã rẽ so với mobile

Mobile fetch client-side + spinner (SEO hỏng). Web **fetch server-side** trong Server
Component + ISR; route nào đọc cookie (auth) thì dynamic. Bìa truyện, thẻ truyện, danh sách
chương, reader đều render HTML thật.

## Phases

| # | Phase | Trạng thái | Deliverable |
|---|-------|-----------|-------------|
| 1 | [Scaffold + skill](phase-01-scaffold.md) | ✅ done | `apps/web` chạy được; skill transitions cài xong |
| 2 | [Migration featured + admin](phase-02-featured.md) | ✅ done | Cột `featured`, Đề cử có nguồn; toggle ở admin |
| 3 | [Design system + primitives + chrome](phase-03-design-system.md) | ✅ done | `@theme` light/dark, `ui/`, doodle, Header/Footer |
| 4 | [Trang chủ](phase-04-home.md) | ✅ done | Panel Đề cử, Đọc tiếp, thể loại, Mới cập nhật |
| 5 | [Thể loại + Tìm kiếm](phase-05-genres-search.md) | ✅ done | `/the-loai`, `/the-loai/[slug]`, `/tim-kiem` |
| 6 | [Chi tiết + Mục lục](phase-06-detail-toc.md) | ✅ done | Hero violet, chapter list phân trang, TOC |
| 7 | [Reader](phase-07-reader.md) | ✅ done | 4 theme, cỡ chữ, resume, prev/next, phím tắt |
| 8 | [Auth + Tủ truyện + Tôi](phase-08-auth-library.md) | ✅ done | Login/đăng ký, tủ truyện, hồ sơ, đăng xuất |
| 9 | [SEO](phase-09-seo.md) | ✅ done | metadata, JSON-LD, sitemap, robots, OG |
| 10 | [Motion](phase-10-motion.md) | ✅ done | Skeleton pulse, like-button, accordion (snippet skill dán nguyên) |
| 11 | [Dark + Verify](phase-11-verify.md) | ✅ done | Dark AA, typecheck/lint/build sạch; RLS + view-source chờ project thật |

## Success criteria

- [x] Chrome + reader mang đúng DESIGN.md: 1 CTA sepia/viewport, radius 10, zero shadow
- [x] Draft (`published=false`) không lộ ra khi ẩn danh — đã kiểm bằng REST thật + `role=anon`
- [x] `view-source` trang truyện/chương có HTML nội dung thật
- [x] Đăng ký → đăng nhập → lưu tủ → "Đọc tiếp" xuyên session — đã kiểm end-to-end
- [x] `pnpm --filter web typecheck` + `lint` + `build` sạch
- [x] Dark mode đạt AA cho text/CTA
- [x] Dấu tiếng Việt đúng (OG image xác nhận; 3 font chrome/reader chờ eyeball)

## Cố tình chệch DESIGN.md

1. Reader có 4 theme (Giấy/Ngả vàng/Đêm/OLED) — DESIGN.md light-only, nhưng đọc đêm là tính năng.
2. Thân truyện Literata @1.8 — ràng buộc kỹ thuật chữ Việt.
3. Doodle đặt ở hero/empty state, không rải khắp nơi — tránh lạc thể loại app đọc truyện.
