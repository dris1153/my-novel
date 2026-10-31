---
phase: 4
title: "Trang chủ"
status: completed
priority: P1
effort: "4h"
dependencies: [2, 3]
---

# Phase 4: Trang chủ

## Overview
Viết lại `(site)/page.tsx` theo mockup với dữ liệu thật; gỡ các khối home cũ. Mobile xếp theo thứ tự trong báo cáo.

## Requirements
- Functional (dữ liệu từng khối xem bảng trong báo cáo):
  - **Banner:** 3 slide tĩnh, chữ + CTA nút tối: "Khám phá thế giới truyện bất tận!" → Mới cập nhật; slide Truyện full; slide Thể loại. Mũi tên, chấm, nút dừng.
  - **Đang đọc** (`tint-lavender`), **Tủ truyện của bạn** (`tint-peach`, số = `state.library.length`, mèo đọc sách).
  - **Mới cập nhật:** 5 thẻ bìa, tên đè trên lớp phủ đáy, không số hạng; "Xem thêm →".
  - **Cùng nhau đọc truyện nhé!** (`tint-sky`), nút → `/the-loai`.
  - **Tiếp tục đọc:** `readingRows` bỏ truyện đầu, tối đa 3; rỗng thì ẩn. **Gợi ý cho bạn:** tối đa 5; rỗng thì ẩn. Một khối ẩn thì khối kia chiếm cả hàng; cả hai ẩn thì không có hàng.
  - Thư viện rỗng: `EmptyState` như hiện tại, vẫn hiện banner.
- Non-functional: không CLS ở banner (khung tỉ lệ cố định), chỉ ảnh đầu `priority`; không gọi thêm GitHub ngoài `fetchAllNovelCards` + `readMyStateOrEmpty`; `await connection()` giữ nguyên, không `force-dynamic`. Lỗi đọc state không làm sập trang chủ (`OrEmpty`).

## Architecture
- `lib/suggest.ts` (thuần, không import `queries`, như `library-rows.ts`):
  ```ts
  suggestNovels<C extends { slug: string; genres: string[] }>(cards: C[], state: UserState, limit = 5): C[]
  // genre yêu thích = genre của truyện trong progress + library
  // loại truyện đã trong progress/library; giữ truyện có ≥1 genre trùng;
  // xếp theo số genre trùng giảm dần, hoà thì giữ thứ tự đầu vào (mới cập nhật trước)
  ```
  State rỗng → `[]` (khối ẩn; "Mới cập nhật" đã phủ trường hợp này).
- `components/home/hero-carousel.tsx`: giữ cơ chế (snap, tự chạy, hover/focus pause, dừng khi vuốt, nút dừng, reduced-motion, focus ring trong); đổi slide thành `{ title, text, cta, href, art }`, thêm 2 nút mũi tên. Chữ dùng token `fg`, lớp phủ `from-canvas/90 via-canvas/50 to-transparent` từ trái để đọc được ở cả 2 theme. Bỏ bìa nhỏ trong slide. Slide text là hằng số trong file.
- `components/home/reading-card.tsx`: thẻ Đang đọc, nhận `LibraryRow`. `home/library-card.tsx`, `home/cover-tile.tsx` (thẻ bìa có tên đè, dùng `NovelCover`), `home/promo-card.tsx`, `home/continue-list.tsx`, `home/suggest-row.tsx`.
- `page.tsx` lấy `all`, `state`, tính `reading = readingRows(all, state)`, truyền xuống; không còn async fetch trong từng thẻ (bỏ `ContinueReading`).
- Lưới desktop: hàng 1 `[banner | cột phải (Đang đọc, Tủ truyện)]`, hàng 2 `[Mới cập nhật | promo]`, hàng 3 `[Tiếp tục đọc | Gợi ý]`. Mobile `flex-col`, Mới cập nhật cuộn ngang snap.
- Mèo ở thẻ có thể tràn ra ngoài góc (`overflow` có chủ đích) như mockup; ảnh trang trí `alt=""`.
- Icon tiêu đề khối (đồng hồ, sao, lửa): SVG nội tuyến dùng token, không thêm ảnh.

## Related Code Files
- Create: `apps/web/src/lib/suggest.ts`, `suggest.test.ts`, `apps/web/src/components/home/{reading-card,library-card,cover-tile,promo-card,continue-list,suggest-row}.tsx`
- Modify: `apps/web/src/app/(site)/page.tsx`, `apps/web/src/components/home/hero-carousel.tsx`
- Delete: `apps/web/src/components/home/{genre-panel,latest-list,shortcut-grid}.tsx`, `apps/web/src/components/novel/continue-reading.tsx`, `apps/web/src/assets/shortcuts/`, `apps/web/public/art/banner-{1,2,3,4}.webp`; `lib/format-date.ts` + test nếu mồ côi (grep trước)

## Implementation Steps
1. `suggestNovels` + test trước: loại truyện đã có, xếp theo số genre trùng, hoà giữ thứ tự, state rỗng, không truyện nào trùng.
2. Các thẻ tĩnh + carousel mới.
3. `page.tsx` + lưới; gỡ file cũ; grep import mồ côi.
4. Thử các trạng thái: chưa đọc gì; 1 truyện đang đọc (ẩn Tiếp tục đọc); thư viện rỗng; banner bằng phím; reduced-motion.
5. Chụp 390 + 1440 + 1280, sáng + tối; so với mockup.

## Success Criteria
- [x] Mỗi khối chỉ hiện dữ liệu thật; khối rỗng ẩn và layout tự co
- [x] Banner chữ đọc được ở cả 3 slide, 2 theme
- [x] Test `suggest` xanh; không còn import tới file đã xoá

## Risk Assessment
- `banner` hiện dùng `/art/banner-N`, xoá cùng commit với carousel mới để không ảnh gãy.
- Bìa nhiều chữ sẵn + tên đè rối → lớp phủ đáy đậm; nếu vẫn rối, báo user phương án để tên dưới bìa.
- Trang chủ dài hơn trên mobile vì thêm thẻ trang trí → đặt promo cuối, hoặc ẩn nếu user thấy thừa.
