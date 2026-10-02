---
phase: 5
title: "Thể loại + Tìm kiếm"
status: done
priority: P1
effort: "1d"
dependencies: [3]
---

# Phase 5: Thể loại + Tìm kiếm

## Overview

Danh mục thể loại, trang truyện theo thể loại (phân trang), tìm kiếm server-side.
Cho phép vào từ nav "Thể loại" và chips ở trang chủ.

## Related Code Files

- Create: `apps/web/src/app/the-loai/page.tsx`, `the-loai/[slug]/page.tsx`
- Create: `apps/web/src/app/tim-kiem/page.tsx`
- Modify: `apps/web/src/lib/queries.ts` (`fetchByGenre`, `searchNovels`, `fetchGenres`) 

## Steps

1. `/the-loai`: lưới tất cả thể loại.
2. `/the-loai/[slug]`: `fetchByGenre` phân trang offset, sắp xếp mới nhất.
3. `/tim-kiem`: đọc `searchParams.q`, gọi `searchNovels` (server), `noindex`.
   Cân nhắc thêm index `pg_trgm` cho `author`.
4. Bộ điều khiển phân trang dùng chung (`PageNav`).

## Success Criteria

- [x] Thể loại lấy từ DB, không hardcode
- [x] Phân trang giữ state trên URL
- [x] Tìm kiếm trả kết quả ở server, `noindex`
