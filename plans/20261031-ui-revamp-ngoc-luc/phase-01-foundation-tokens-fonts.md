---
phase: 1
title: "Nền tảng: token, font, theme, primitive"
status: completed
priority: P1
effort: "3h"
dependencies: []
---

# Phase 1: Nền tảng

## Overview
Đổi giá trị token sang xanh lục light-first, thêm `hot-fg` + `bar`/`on-bar`, Roboto Condensed thay Noto Serif, bỏ tint màu bìa, sửa primitive dùng chung. Sau phase này mọi trang vẫn chạy, chỉ đổi màu/font.

## Requirements
- Functional: light mặc định; picker Tự động/Sáng/Tối vẫn chạy; tiêu đề dùng `font-heading`.
- Non-functional: mọi cặp chữ/nền ≥4.5:1 (test); không hex thô trong component.

## Architecture
Token (giữ tên cũ để không phải sửa utility; chỉ đổi giá trị + thêm 3 token):

| Token | `:root` (light) | `html.dark` |
|---|---|---|
| canvas | #f0f2f5 | #111113 |
| surface | #ffffff | #18191b |
| subtle | #f7f8fa | #212225 |
| raised | #ffffff | #272a2d |
| hover | #eef0f3 | #2e3135 |
| line / line-strong | #e4e6eb / #cdd0d5 | #2e3135 / #43484e |
| fg / fg-2 / fg-3 | #1c2024 / #60646c / #65696f | #edeef0 / #b0b4ba / #9a9ea6 |
| accent / on-accent | #15803d / #ffffff | #22c55e / #052e16 |
| accent-fg / accent-soft | #166534 / #dcfce7 | #4ade80 / #12261a |
| hot-fg (mới) | #b91c1c | #f87171 |
| bar / on-bar (mới) | #2f3640 / #ffffff | #18191b / #edeef0 |

- Xoá `--tint-card`, `--tint-hero`. Giữ `--ink-art` tới phase 6 (lúc bỏ hẳn `InkArt`).
- Radius: `--radius-cover: 4px`, `--radius-card: 8px`, `--radius-sheet: 16px`; thêm `--radius-control: 6px` nếu button cần.
- Font: `Roboto_Condensed` (`next/font/google`, variable, `subsets: ["latin","vietnamese"]`) → `--font-roboto-condensed`; `@theme` `--font-heading`. Bỏ `--font-serif` + `Noto_Serif`.
- Mọi `font-serif` (≈25 chỗ) → `font-heading` (thay cơ học; Roboto Condensed đậm hơn nên `font-semibold` → `font-bold` ở tiêu đề).
- `ThemeProvider defaultTheme="light"`; `viewport.themeColor` → `#ffffff`.

## Related Code Files
- Modify: `apps/web/src/app/globals.css`, `apps/web/src/app/layout.tsx`, `apps/web/src/components/theme-provider.tsx`, `apps/web/src/lib/contrast.test.ts`, `components/ui/{button,tag,section-heading,skeleton}.tsx`, mọi file có `font-serif`, mọi file có `bg-surface`
- Modify (bỏ tint): `app/(site)/truyen/[slug]/page.tsx` (div nền radial), `components/novel/continue-reading.tsx`
- Delete: `apps/web/src/lib/tint.test.ts`

## Implementation Steps
1. `globals.css`: giá trị token mới + 3 token mới trong `:root`/`html.dark`, map `--color-hot-fg`, `--color-bar`, `--color-on-bar` trong `@theme inline`; sửa comment đầu file (light-first, Ngọc Lục).
2. `contrast.test.ts`: thêm `hot-fg` vào `TEXT`; thêm cặp `["on-bar","bar"]`, `["accent-fg","subtle"]` vào test nút nhấn. Chạy `pnpm --filter web test` → phải xanh trước khi sửa component.
3. Font: thêm Roboto Condensed, bỏ Noto Serif trong `layout.tsx`; thay `font-serif` → `font-heading` toàn `src`.
4. Theme provider light-first; themeColor.
5. Rà 12 chỗ `bg-surface`: fill nằm trong khối trắng (chip, skeleton, placeholder, input) → `bg-subtle`; khối/card → giữ `bg-surface`. Header/tab bar `bg-canvas/95` → `bg-surface`.
6. Primitive:
   - `Button`: variant `primary` (bg-accent, text-on-accent), thêm `secondary` (bg-subtle + border-line, text-fg — nút xám "DS.Chương", "‹ Trước"), giữ `ghost`; radius 6px.
   - `Tag`: viền `accent-fg` chữ `accent-fg` (chip thể loại kiểu TruyenYY); `active` → bg-accent text-on-accent.
   - `SectionHeading`: vạch trái 4px `bg-accent` + tiêu đề `font-heading` uppercase/đậm; action dạng "Thêm →" `text-accent-fg`.
7. Bỏ tint: xoá div radial ở trang truyện + `backgroundImage` ở `continue-reading.tsx`; xoá `tint.test.ts`.
8. `pnpm typecheck && pnpm test && pnpm --filter web lint`.

## Success Criteria
- [ ] contrast test xanh với token mới (light + dark)
- [ ] grep `font-serif`, `Noto_Serif`, `tint-`, `f2b25c` trong `apps/web/src` → không còn
- [ ] Mở app (chưa chọn theme) ra light; chọn Tối vẫn ra dark
- [ ] Chip/skeleton vẫn thấy được trên khối trắng

## Risk Assessment
- Giá trị contrast trong báo cáo tính tay → test là nguồn thật; trượt thì chỉnh hex, không nới ngưỡng.
- Roboto Condensed + dấu chồng (Ẩn, Ệ, Ồ) ở `leading-tight` có thể bị cắt → dùng `leading-snug` cho tiêu đề 2 dòng.
