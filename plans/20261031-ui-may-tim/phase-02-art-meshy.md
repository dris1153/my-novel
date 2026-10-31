---
phase: 2
title: "Art Meshy"
status: completed
priority: P1
effort: "1.5h + thời gian user duyệt"
dependencies: []
---

# Phase 2: Art Meshy

## Overview
Sinh 7 ảnh pastel anime cho khung app + trang chủ bằng `gpt-image-2-5-sunburst`, lấy mockup làm mẫu phong cách. User đã duyệt ngân sách 120 credit (số dư lúc duyệt 273).

## Requirements
- Functional: `public/art/hero-{1,2,3}.webp`, `mascot-cat.webp`, `cat-reading.webp`, `boy-cat.webp`, `logo-book.webp`.
- Non-functional: hero 1200×675 ≤130 KB; mascot/logo 384–512² ≤40 KB, nền trong suốt. Không chữ, không logo, không nhân vật có bản quyền.

## Architecture
- Cắt vùng tham chiếu từ `reference-mockup.png` bằng sharp, lưu ở scratchpad (không commit): banner, mèo sidebar, cậu bé + mèo. Dùng làm `reference_file_paths` của `meshy_image_to_image` (12 credit/ảnh).
- Không cắt thẳng mockup làm asset: độ phân giải thấp, dính chữ/nút.
- Prompt mở đầu: *"Use the reference image as a style reference (soft pastel anime illustration, palette, lighting, line quality). Recreate cleanly at high quality. No text, no letters, no logo, no watermark, no UI elements, no buttons."*
- **Điểm dừng:** sinh `hero-1` + `mascot-cat` (24 credit) → cho user xem → user duyệt/sửa → mới sinh 5 ảnh còn lại, dùng 2 ảnh mẫu đã duyệt làm tham chiếu để giữ cùng con mèo.
- Timeout/5xx: `meshy_list_tasks` trước khi tạo lại (có thể đã trừ credit). Dừng ở 120 credit.

| Asset | Tỉ lệ | Nội dung |
|---|---|---|
| hero-1 | 16:9 | Cô gái tai mèo tóc đen ngủ gục trên chồng sách, ôm mèo tam thể, cửa sổ nắng, kệ sách; **40% trái sáng, ít chi tiết** để đặt chữ |
| hero-2 | 16:9 | Cùng phong cách: thư viện trên mây, sách bay, ánh tím hồng; trái trống (slide Truyện full) |
| hero-3 | 16:9 | Cùng phong cách: mèo và cô gái chọn sách giữa giá sách nhiều màu; trái trống (slide Thể loại) |
| mascot-cat | 1:1, trong suốt | Mèo tam thể nằm trên mây, bong bóng trái tim (sidebar) |
| cat-reading | 1:1, trong suốt | Cùng con mèo ôm quyển sách xanh trên mây (thẻ Tủ truyện) |
| boy-cat | 1:1, trong suốt | Cậu bé tóc nâu nằm đọc sách trên mây, mèo trên đầu (thẻ trang trí) |
| logo-book | 1:1, trong suốt | Quyển sách mở xanh tím + sao vàng, nét dày, đọc được ở 40px |

- Chuyển WebP: `apps/web/scripts/art-to-webp.mjs` (có sẵn trên main). PNG gốc không commit.
- Banner + icon cũ gỡ ở phase 4, khi không còn chỗ dùng.

## Related Code Files
- Create: `apps/web/public/art/{hero-1,hero-2,hero-3,mascot-cat,cat-reading,boy-cat,logo-book}.webp`, `plans/20261031-ui-may-tim/art-prompts.md`

## Implementation Steps
1. `meshy_check_balance`; cắt tham chiếu.
2. Sinh hero-1 + mascot-cat; tải về scratchpad; xem trên nền sáng + tối; **dừng, hỏi user**.
3. Sinh 5 ảnh còn lại; duyệt: không chữ, cùng con mèo, nền trong thật, logo đọc được ở 40px.
4. Chuyển WebP, kiểm dung lượng; ghi prompt, task id, credit vào `art-prompts.md`.

## Success Criteria
- [x] User duyệt 2 ảnh mẫu trước khi sinh tiếp
- [x] 7 ảnh trong ngân sách dung lượng; tổng credit ≤120

## Risk Assessment
- Mèo khác nhau giữa các ảnh → tham chiếu ảnh mẫu đã duyệt, sinh lại trong trần credit.
- Logo AI khó sắc ở cỡ nhỏ → nếu không đạt thì dùng SVG đơn giản thay vì tốn thêm credit.
- `remove_background` để viền trắng → lộ trên dark; kiểm trên nền tối.
