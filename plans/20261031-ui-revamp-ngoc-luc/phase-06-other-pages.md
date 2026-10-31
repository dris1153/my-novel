---
phase: 6
title: "Thể loại, tìm kiếm, tủ truyện, Tôi, sign-in, trang trống/lỗi"
status: completed
priority: P2
effort: "3h"
dependencies: [2, 3]
---

# Phase 6: Các trang còn lại + art màu

## Overview
Đổi kiểu các trang còn lại sang khối trắng trên nền xám; thay art thủy mặc (mask) bằng art màu Meshy ở sign-in, trạng thái trống, 404, lỗi; gỡ hẳn hệ mask.

## Requirements
- Thể loại `/the-loai`: lưới ô thể loại (tên `font-heading` + số truyện, 2 cột mobile / 4 desktop), giữ mosaic bìa nhỏ nếu vừa; trang thể loại: tiêu đề + `GenreChips` (chip viền xanh) + `PagedNovelGrid` (phase 4).
- Tìm kiếm: ô tìm lớn (input `bg-subtle`, nút `bg-accent` "Tìm") + chip thể loại + lưới kết quả.
- Tủ truyện: tab phân đoạn Đang đọc / Theo dõi (nền `bg-subtle`, tab chọn `bg-accent text-on-accent`), dòng `LibraryRow` trong khối trắng, giữ thanh tiến độ (`bg-accent`) + badge "+N" (`bg-accent text-on-accent`; `hot-fg` chỉ dành cho số chương).
- Tôi: avatar chữ cái `bg-accent-soft text-accent-fg`, khối trắng cho theme picker + đăng xuất.
- Sign-in: art `sign-in.webp` (3:4) bo góc trên, tiêu đề wordmark "Truyện" (`font-heading`, `text-accent-fg`) thay "Thư viện đêm", phần còn lại giữ nguyên (form Google, thông báo bị từ chối).
- Trạng thái trống / 404 / lỗi: spot màu nền trong, 160–192px.

## Architecture
- `components/ui/ink-art.tsx` → `components/ui/illustration.tsx`: `<Image src={`/art/${name}.webp`} unoptimized width height alt="" />` (trang trí, `alt=""`; nội dung đã có ở tiêu đề). **Bắt buộc `unoptimized`**: `/_next/image` không nằm trong miễn trừ gate → ảnh sign-in sẽ hỏng trước đăng nhập.
- `EmptyArt` type đổi theo `IllustrationName`; API `EmptyState` giữ nguyên → các nơi gọi không đổi.
- Thay `public/art/{sign-in,empty-library,no-results,no-chapters,not-found,error}.webp` bằng bản màu từ phase 2 (cùng tên → không đổi đường dẫn, gate không đổi).
- Gỡ: `ink-art.tsx`, `--ink-art` + `--color-ink-art` trong `globals.css`, `scripts/ink-to-mask.mjs`.

## Related Code Files
- Create: `components/ui/illustration.tsx`
- Modify: `app/(site)/{the-loai/page.tsx,the-loai/[slug]/**,tim-kiem/page.tsx,tu-truyen/page.tsx,toi/page.tsx,dang-nhap/page.tsx,error.tsx,not-found.tsx}`, `components/novel/{genre-tile,genre-chips,library-row}.tsx`, `components/chrome/theme-picker.tsx`, `components/ui/empty-state.tsx`, `app/globals.css`, `public/art/*.webp`
- Delete: `components/ui/ink-art.tsx`, `scripts/ink-to-mask.mjs`

## Implementation Steps
1. `Illustration` + đổi `EmptyState`, `error.tsx`, sign-in sang dùng nó; chép art màu vào `public/art/`.
2. Gỡ `InkArt`, token `ink-art`, script mask; grep `ink-art|InkArt|ink-to-mask` → rỗng.
3. Đổi kiểu thể loại, tìm kiếm, tủ truyện, Tôi.
4. Thử sign-in ở cửa sổ ẩn danh (chưa đăng nhập): ảnh tải được (200, không redirect) — `curl -I $BASE/art/sign-in.webp`.
5. Chụp 390/1440 các trang + trạng thái trống (tìm từ khoá vô nghĩa, tủ truyện rỗng, `/khong-co`).

## Success Criteria
- [ ] Sign-in hiện ảnh khi chưa đăng nhập; `gate.test.ts` vẫn xanh (không sửa matcher)
- [ ] Không còn mask/thủy mặc trong code
- [ ] Spot nhìn ổn trên cả nền sáng và tối

## Risk Assessment
- Spot màu chói trên dark → giảm kích thước, có thể `dark:opacity-90`; không lọc màu.
- Đổi file cùng tên → trình duyệt cache ảnh cũ (`public/` không hash) → chấp nhận (người dùng ít), hoặc thêm `?v=2` vào `src` trong `Illustration`.
