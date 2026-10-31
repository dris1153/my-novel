---
phase: 1
title: "Nền tảng: token, font, bo góc"
status: completed
priority: P1
effort: "1.5h"
dependencies: []
---

# Phase 1: Nền tảng

## Overview
Đổi giá trị token sang bảng pastel + tím đêm, thêm 3 tint, đổi font sang Nunito, đổi bo góc. Giữ tên token cũ để mọi trang tự nhận màu mới mà không phải sửa utility.

## Requirements
- Functional: bảng token đúng báo cáo; `font-sans` và `font-heading` đều ra Nunito; theme mặc định vẫn light.
- Non-functional: mọi cặp chữ/nền ≥4.5:1 (test đọc `globals.css`). Giá trị đã tính tay trước: min 4.87 light, 5.79 dark; test là nguồn thật.

## Architecture
- `globals.css`: giá trị theo bảng trong `plans/reports/brainstorm-20261031-ui-may-tim.md`. Thêm `--tint-lavender`, `--tint-peach`, `--tint-sky` + map `--color-*` trong `@theme inline`. `bar`/`on-bar` giờ là màu nút tối (và vẫn là thanh trên reader).
- Bo góc: `--radius-cover: 14px`, `--radius-card: 24px`, `--radius-control: 9999px`; `--radius-sheet` giữ 16px.
- Font: `Nunito` (`next/font/google`, variable, `subsets: ["latin","vietnamese"]`) → `--font-nunito`; `--font-sans` và `--font-heading` cùng trỏ vào đó (không đổi hàng loạt class `font-heading`, vòng sau có thể gộp).
- Lưu ý: `reader-shell.tsx:167` dùng thẳng `var(--font-be-vietnam)` cho kiểu "Không chân" → đổi sang `var(--font-nunito)`.
- `viewport.themeColor` → `#fcf8f8`.

## Related Code Files
- Modify: `apps/web/src/app/globals.css`, `apps/web/src/app/layout.tsx`, `apps/web/src/lib/contrast.test.ts`, `apps/web/src/components/reader/reader-shell.tsx`, `apps/web/src/components/ui/button.tsx` (nếu radius cần chỉnh)

## Implementation Steps
1. `git fetch && git checkout -b feat/ui-may-tim origin/main` (mang theo các file plan/report chưa track của plan này).
2. Thêm 3 tint vào `BACKGROUNDS` trong `contrast.test.ts`, sửa giá trị token; `node --test src/lib/contrast.test.ts` phải xanh trước khi đi tiếp.
3. Đổi font trong `layout.tsx`, sửa reader-shell.
4. `pnpm --filter web exec next typegen`, `pnpm typecheck`, `pnpm test`.
5. Sửa comment đầu khối token + comment font cho khớp hệ mới.

## Success Criteria
- [x] Contrast test xanh cả 2 theme, có 3 tint
- [x] grep `font-be-vietnam`, `font-roboto`, `Roboto_Condensed`, `Be_Vietnam_Pro` trong `apps/web/src` → không còn

## Risk Assessment
- Dấu tiếng Việt chồng (ệ, ồ, ử) với Nunito ở `leading-tight` có thể bị sát → kiểm bằng ảnh chụp ở phase 5.
- `--radius-control` full làm segment/ô nhập trang cũ thành viên thuốc: chấp nhận, kiểm không vỡ.
