---
phase: 4
title: "Trang chủ + trang danh sách"
status: completed
priority: P1
effort: "5h"
dependencies: [2, 3]
---

# Phase 4: Trang chủ + trang danh sách

## Overview
Trang chủ theo bố cục TruyenYY (carousel, ô tìm, lối tắt, kệ 4 cột) chỉ với dữ liệu thật; thêm `/danh-sach/[kind]` làm đích cho "Thêm →", lối tắt và nav desktop.

## Requirements
- Mobile (thứ tự): Carousel → ô tìm (`form action="/tim-kiem"`) → `ContinueReading` (nếu có, không còn fallback banner) → lưới 6 lối tắt (3×2) → "Truyện mới cập nhật" (4 cột, 8 truyện, "Thêm →" `/danh-sach/moi-cap-nhat`) → dòng phân cách khẩu hiệu (vd "Đọc truyện chữ, không quảng cáo") → "Truyện hoàn thành" (`status === "completed"`, 8, ẩn nếu <4, "Thêm →" `/danh-sach/hoan-thanh`).
- Desktop (≥1024px): hàng 1 `[panel thể loại slate 240px | carousel | ContinueReading 300px]` (không có Đọc tiếp → carousel rộng ra); hàng 2 "Mới cập nhật" dạng danh sách chữ 12 dòng (tên · thể loại · `Chương N` màu `hot-fg` · ngày cập nhật dd/MM) cạnh "Chọn lọc" (truyện `featured`, bìa + tên + tác giả + số chương; không có → danh sách chiếm hết); hàng 3 "Truyện hoàn thành" lưới 6 cột.
- Carousel: slide = truyện `featured`, thiếu thì lấy 4 truyện mới nhất; mỗi slide = banner AI (xoay vòng `banner-1..4`) + scrim gradient + bìa nhỏ + tên + thể loại + nút "Đọc ngay" (→ `/truyen/[slug]`). Scroll-snap, chấm chỉ vị trí (nút), tự chạy 5s; dừng khi hover/focus-within/tab ẩn; tắt hẳn khi `prefers-reduced-motion`. Chỉ ảnh đầu `priority`.
- Lối tắt: icon Fluent (import tĩnh) + nhãn; đích như báo cáo (Mới cập nhật, Truyện full, Thể loại, Đang đọc `?tab=dang-doc`, Tủ truyện `?tab=theo-doi`, Tìm kiếm).
- `/danh-sach/moi-cap-nhat`, `/danh-sach/hoan-thanh` + `/trang/[page]`: tiêu đề + `NovelGrid` + `PageNav`; `kind` lạ → `notFound()`.
- Bỏ: `WelcomeBanner`, `GenreChips` trên trang chủ, lưới "Tất cả truyện".

## Architecture
- `queries.ts`: thêm `fetchCompleted(limit, offset)` (lọc `status === "completed"` trên index, giữ thứ tự cập nhật). Chỉ dữ liệu index — không gọi `fetchNovel` từng truyện.
- DRY phân trang: tổng quát hoá `GenreList` → `PagedNovelGrid({ load, basePath, page, empty })` (`load(limit, offset)`; server component nhận hàm được vì không serialize). Trang thể loại và danh sách cùng dùng; giữ `GENRE_PAGE_SIZE` (đổi tên `PAGE_SIZE`).
- Danh sách kind: một map `LISTS = { "moi-cap-nhat": { title, load: fetchRecent }, "hoan-thanh": { title, load: fetchCompleted } }` trong `lib/lists.ts`; `generateStaticParams` không cần (trang gọi `connection()`/revalidate như trang thể loại).
- Carousel = client component nhỏ (`components/home/hero-carousel.tsx`, `"use client"`), nhận slide đã chuẩn bị từ server; không thư viện. Slide là `<a>` trong `<ul>`, `aria-roledescription="carousel"`, nút chấm có `aria-label`.
- `Shelf` hiện có → lưới 4 cột (mobile) / 6 cột (desktop) thay vì cuộn ngang, giữ props.
- Thẻ truyện (`NovelGridCard`): tên `font-heading` đậm 2 dòng + tác giả `text-fg-2`; bìa radius 4px.
- Panel thể loại: dùng `fetchGenreTiles()` (đã có, có `count`), nền `bg-bar text-on-bar`.
- Ảnh banner: `next/image` `unoptimized` (đường `/_next/image` bị gate) + `sizes`.

## Related Code Files
- Create: `components/home/{hero-carousel,shortcut-grid,latest-list,divider-tagline}.tsx`, `lib/lists.ts`, `app/(site)/danh-sach/[kind]/page.tsx`, `app/(site)/danh-sach/[kind]/trang/[page]/page.tsx`, `components/novel/paged-novel-grid.tsx` (từ `genre-list.tsx`)
- Modify: `app/(site)/page.tsx`, `lib/queries.ts`, `components/novel/{shelf,novel-card,continue-reading}.tsx`, `app/(site)/the-loai/[slug]/page.tsx` + `trang/[page]/page.tsx` (dùng `PagedNovelGrid`)
- Delete: `components/novel/welcome-banner.tsx`, `components/novel/genre-list.tsx`, `public/art/home-banner.webp`

## Implementation Steps
1. `fetchCompleted` + test nhỏ cho lọc (nếu tách được hàm thuần, vd `pickCompleted(novels)` trong `lib/lists.ts` + `lists.test.ts`).
2. `PagedNovelGrid`; chuyển trang thể loại sang dùng nó; thêm 2 route danh sách.
3. `HeroCarousel` + `ShortcutGrid` + `LatestList`; viết lại `HomePage` theo thứ tự mobile, lưới desktop bằng `lg:grid`.
4. Chụp 390/1440; kiểm carousel: vuốt, Tab tới slide, chấm, reduced-motion (DevTools emulate).

## Success Criteria
- [ ] Mọi khối trên trang chủ chỉ hiện dữ liệu có thật; khối rỗng thì ẩn
- [ ] `/danh-sach/hoan-thanh` chỉ có truyện completed; trang 2 hoạt động; kind lạ → 404
- [ ] Carousel không gây CLS (khung `aspect-[16/9]` cố định), không cuộn ngang trang ở 390px

## Risk Assessment
- Autoplay gây khó chịu/a11y → dừng khi tương tác, tắt với reduced-motion, có chấm điều khiển.
- Ít truyện (thư viện nhỏ) → ngưỡng ẩn khối; carousel 1 slide thì ẩn chấm, không tự chạy.
