---
phase: 11
title: "Dark + Verify"
status: pending
priority: P2
effort: "0.5d"
dependencies: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
---

# Phase 11: Dark pass + Verify

## Overview

Cân lại dark mode cho đạt AA và kiểm chứng toàn bộ không phá gì.

## Kết quả

| Hạng mục | Kết quả |
|---|---|
| `pnpm --filter web typecheck` / `lint` / `build` | ✅ sạch |
| DB thật (Supabase `novel`) | ✅ 7 bảng, 10 thể loại seed, 3 migration (`init`, `novel_featured`, `harden_trigger_function_grants`) |
| **RLS — ẩn danh không thấy nháp** | ✅ REST trả 1/2 truyện; chương của truyện nháp không lộ; `role=anon` trong SQL cũng chỉ thấy 1 |
| **RLS — user chỉ thấy dữ liệu của mình** | ✅ insert/đọc `library` + `reading_progress` OK; giả danh user khác bị chặn `42501`; anon POST bị 401 |
| **Auth end-to-end** | ✅ signup → trigger tạo `profiles` (display_name + role reader) → confirm email → signin → ghi library |
| **`view-source` có nội dung thật** | ✅ reader: nội dung chương + `<title>Chương 1: …` + JSON-LD `Book`+`Chapter`; trang chi tiết: link cả 3 chương; home: panel Đề cử |
| **404 đúng status** | ✅ truyện nháp / truyện lạ / chương lạ / thể loại lạ đều 404 (đã sửa soft-404, xem dưới) |
| Security advisors | ⚠ còn 2 loại, đều cố ý — xem dưới |
| `prefers-reduced-motion` | ✅ có đủ ở cả 3 transition |
| OG image tiếng Việt | ✅ render đúng dấu (`Truyện`, `Đọc truyện chữ online…`) |
| `pnpm test` (shared + crawler) | ✅ 11/11 |
| `pnpm typecheck` toàn workspace | ⚠ `apps/mobile` fail **có sẵn từ trước** — thiếu `expo-env.d.ts`/`.expo/types` do chưa chạy `pnpm mobile` (AGENTS.md đã ghi). `apps/web`, `apps/admin`, `shared`, `crawler` đều sạch |

## Bug tìm thấy & đã sửa trong lúc verify

**Soft-404.** `loading.tsx` bọc page trong Suspense → Next flush header **200 trước khi**
`notFound()` chạy, nên `/truyen/<truyện-nháp>` trả 200 kèm UI "Không tìm thấy" (không lộ dữ
liệu, nhưng SEO tính là soft-404).

Sửa: bỏ 4 file `loading.tsx`, thay bằng `<Suspense>` **bên trong** page, đặt *sau* bước kiểm
tra tồn tại (`fetchNovel` → `notFound()` → rồi mới Suspense phần danh sách chương / lưới
truyện / mục lục). Được cả hai: 404 đúng status **và** vẫn có skeleton khi stream.

*Đánh đổi:* phần danh sách chương của trang chi tiết giờ được stream (React chèn
`<!-- -->` giữa các text node), không còn nằm phẳng trong HTML đầu tiên. Nội dung chương
(trang quan trọng nhất cho SEO) thì **không** stream — vẫn inline.

## Security advisors còn lại (đều cố ý)

- `extension_in_public` — `unaccent`, `pg_trgm` nằm ở schema `public`. Sửa được nhưng phải
  tạo lại index `novels_title_trgm`; chưa làm vì rủi ro không tương xứng.
- `anon/authenticated can execute SECURITY DEFINER` — `increment_view` (app gọi RPC để đếm
  lượt đọc), `is_admin` (RLS phụ thuộc — revoke là vỡ policy), `rls_auto_enable` (Supabase
  quản).
- Đã đóng 2 cái thừa: `handle_new_user`, `bump_novel_updated` (trigger không kiểm quyền
  EXECUTE lúc chạy → revoke không đổi hành vi; đã verify signup vẫn tạo profile đúng).

## Success Criteria

- [x] Build + lint + typecheck sạch (web)
- [x] RLS đúng (kiểm bằng REST thật + `role=anon`)
- [x] 404 đúng status cho mọi route động
- [x] Auth end-to-end qua Supabase thật
- [x] `view-source` có nội dung thật
- [x] Dark AA
- [x] Dấu tiếng Việt đúng (OG image xác nhận; 3 font chrome/reader còn chờ eyeball)
