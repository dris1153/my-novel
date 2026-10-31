---
phase: 1
title: "Nền tảng: token, font, theme, primitive"
status: completed
priority: P1
effort: "4h"
dependencies: []
---

# Phase 1: Nền tảng — token, font, theme, primitive

## Overview
Thay hệ token Opennote bằng "Thư viện đêm" (dark + light), nạp 3 font có subset tiếng Việt, đặt dark làm mặc định, làm lại các primitive UI dùng chung. Mọi phase sau dựng trên đây.

## Requirements
- Functional: token dark/light; theme mặc định dark, có Tự động/Sáng/Tối; primitive Button/Chip/Card/Input/Skeleton/SectionHeading theo hệ mới.
- Non-functional: mọi cặp chữ/nền ≥4.5:1 (chữ ≥24px hoặc icon ≥3:1); không layout shift do font (next/font).

## Architecture
`globals.css`:
```css
:root{ /* light */ --bg:#fcfcfd; --bg-subtle:#f9f9fb; --surface:#f0f0f3; --raised:#ffffff;
  --hover:#e8e8ec; --border:#d9d9e0; --border-strong:#cdced6;
  --text:#1c2024; --text-2:#60646c; --text-3:#80838d;
  --accent:#F2B25C; --on-accent:#1a1206; --accent-text:#8a5200; --ink-art:#1c2024; }
html.dark{ --bg:#111113; --bg-subtle:#18191b; --surface:#212225; --raised:#272a2d;
  --hover:#2e3135; --border:#2e3135; --border-strong:#43484e;
  --text:#edeef0; --text-2:#b0b4ba; --text-3:#777b84;
  --accent:#F2B25C; --on-accent:#1a1206; --accent-text:#F2B25C; --ink-art:#edeef0; }
@theme inline { --color-bg: var(--bg); … --font-sans/--font-serif/--font-read … --radius-* }
```
- `--accent-text` tách khỏi `--accent` vì hổ phách không đủ tương phản làm chữ trên nền sáng.
- Radius: `--radius-cover:6px`, `--radius-card:14px`, `--radius-sheet:22px`; chip = full.
- Elevation trên dark = bước surface + viền 1px, không đổ bóng (trừ bìa: bóng mềm).
- Font (`app/layout.tsx`): `Be_Vietnam_Pro` (400/500/600/700) → `--font-sans`; `Noto_Serif` (600/700) → `--font-serif`; `Literata` chuyển sang `(reader)/layout.tsx` → `--font-read`. Tất cả `subsets: ["vietnamese","latin"]`.
- ThemeProvider: `defaultTheme="dark"`, giữ `enableSystem`.
- Giữ rule `cursor: pointer` trong `@layer base`.

## Related Code Files
- Modify: `apps/web/src/app/globals.css` (thay toàn bộ token), `apps/web/src/app/layout.tsx`, `apps/web/src/app/(reader)/layout.tsx`, `apps/web/src/components/theme-provider.tsx`
- Modify (primitive): `components/ui/{button,card,input,skeleton,section-heading,tag}.tsx` (`tag` → chip pill), `components/ui/page-nav.tsx`, `components/ui/like-button.tsx` (màu)
- Create: `apps/web/src/lib/contrast.test.ts` (đọc biến từ `globals.css`, kiểm các cặp chữ/nền ở `:root` và `html.dark`)
- Delete: `components/doodles/index.tsx` (sau khi phase 4/5/8 gỡ hết chỗ dùng — xoá ở phase 9 nếu còn tham chiếu)

## Implementation Steps
1. Viết token mới + `@theme inline` map sang utility (`bg-bg`, `bg-surface`, `text-text-2`, `text-accent-text`, `bg-accent`, `border-border`…). Giữ tên ngắn, nhất quán.
2. Đổi font trong root layout; Literata chỉ ở reader layout.
3. Làm lại primitive: Button (primary = `bg-accent text-on-accent`, ghost = viền `border-strong`, cao ≥44px, radius 12), Chip (pill 13px, active đảo màu), Card (surface + viền), Input (surface, focus ring accent), SectionHeading (Noto Serif 18–20px + link "Xem tất cả").
4. `contrast.test.ts`: parse 2 khối biến, hàm luminance WCAG, assert ≥4.5 cho (text, text-2, accent-text) trên (bg, surface, raised) và on-accent trên accent; ≥3 cho text-3. Chạy trong `pnpm test`.
5. Chạy typecheck — sẽ vỡ ở nơi dùng token cũ: ghi danh sách, sửa tạm bằng token mới tương đương để build xanh (trang được làm lại ở phase 2–7).

## Success Criteria
- [ ] `contrast.test.ts` xanh (nếu `#8a5200` không đạt → chỉnh tới khi đạt)
- [ ] Không còn biến `--paper/--sepia/--violet/--forest/--oxblood/--margin/--halo` trong code
- [ ] Mở site lần đầu (không cookie theme) → dark
- [ ] typecheck/lint/build xanh

## Risk Assessment
- Đổi token làm vỡ style mọi trang cùng lúc → bước 5 đổi tên cơ học để giữ build xanh, phase sau mới làm đẹp.
- Font tiếng Việt: kiểm "ệ ồ ử ặ ẫ ậ" ở Be Vietnam Pro + Noto Serif khi chạy dev.
