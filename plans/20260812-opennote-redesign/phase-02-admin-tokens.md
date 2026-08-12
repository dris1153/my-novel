---
phase: 2
title: "Admin re-tokenize"
status: pending
priority: P1
effort: "2h"
dependencies: []
---

# Phase 2: Admin re-tokenize

## Overview

Đổi `@theme` trong admin globals.css sang token Opennote + swap font Next. Admin dùng class
Tailwind token nên phần lớn tự cập nhật; ít hardcode.

## Requirements

- Functional: admin (login, dashboard, novel list, form, chapter import) mang palette + font Opennote.
- Non-functional: cursor-pointer + focus state giữ nguyên; không đổ bóng mới.

## Architecture

Admin `globals.css` dùng `@theme` custom tokens (color-paper, color-ink, color-sienna...).
Đổi giá trị token → mọi class `bg-paper`/`text-ink`/`bg-sienna`... tự cập nhật. Đổi tên token
sienna→sepia sẽ phải sửa mọi class `*-sienna` — hoặc GIỮ tên `sienna` nhưng đổi giá trị sang
#512906 (ít sửa hơn, KISS). Chọn: giữ tên class, đổi giá trị.

Font: `layout.tsx` đang dùng `Be_Vietnam_Pro`. Thêm `Source_Serif_4` cho headline + đổi UI sang
`Inter`. Áp serif cho heading qua class hoặc CSS.

## Related Code Files

- Modify: `apps/admin/src/app/globals.css` (@theme: đổi giá trị color tokens sang Opennote; thêm violet/forest)
- Modify: `apps/admin/src/app/layout.tsx` (next/font: Inter + Source_Serif_4, subset vietnamese)
- Modify: components dùng heading nếu cần class serif: `page.tsx` (dashboard), `novel-form.tsx`,
  `login/page.tsx` — đổi title sang font serif
- Rà: bất kỳ hex hardcode (scan cho thấy admin sạch, xác nhận lại)

## Implementation Steps

1. `globals.css` `@theme`: giữ tên class hiện có, đổi giá trị:
   `--color-paper: #fffdf8`, `--color-surface: #fffdf8`, `--color-raised: #f9f9f9`,
   `--color-ink: #0a0a0a`, `--color-ink-2: #474747`, `--color-ink-3: #8c8c8c`,
   `--color-line: #e5e5e5`, `--color-sienna: #512906` (giữ tên, giá trị sepia),
   `--color-sienna-soft: #f2ece3`, thêm `--color-violet: #242d64`, `--color-forest: #0c3b1a`,
   `--color-ok: #0c3b1a` (dùng forest cho "đã đăng"). Bỏ gold nếu không dùng.
2. Đổi `--font-sans` → Inter, thêm `--font-serif` → Source Serif 4.
3. `layout.tsx`: `Inter({subsets:['latin','vietnamese'],variable:'--font-inter'})` +
   `Source_Serif_4({subsets:['latin','vietnamese'],variable:'--font-serif'})`. Gắn cả 2 vào html.
4. Heading trong dashboard/form/login → `font-[family-name:var(--font-serif)]` hoặc class util,
   weight 400 (không bold serif).
5. Radius: đảm bảo mọi `rounded-*` về 10px (Opennote một radius). Kiểm class rounded hiện có.
6. `pnpm --filter admin typecheck` + `next build` thử (hoặc để phase 3).

## Success Criteria

- [ ] Admin canvas #fffdf8, CTA sepia #512906, "đã đăng" pill forest
- [ ] Heading dùng Source Serif 4 weight 400; body/table Inter
- [ ] Không còn màu sienna cam #B4462A hay tím SaaS
- [ ] `pnpm --filter admin typecheck` sạch
- [ ] Interactive elements vẫn có cursor-pointer (Tailwind v4 base rule giữ nguyên)

## Risk Assessment

- Đổi giá trị token nhưng tên class cũ (`sienna`) giờ mang màu sepia → gây nhầm khi đọc code.
  Chấp nhận (KISS, ít sửa); ghi comment trong globals.css rằng "sienna" nay là sepia Opennote.
- next/font vietnamese subset cho Source Serif 4: xác nhận build không lỗi ở phase 3.
