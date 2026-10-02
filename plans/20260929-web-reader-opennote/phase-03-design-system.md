---
phase: 3
title: "Design system + primitives + chrome"
status: done
priority: P0
effort: "1.5d"
dependencies: [1]
---

# Phase 3: Design system + primitives + chrome + doodle

## Overview

Dựng nền tảng thị giác cho `apps/web` theo **đúng** DESIGN.md: token light + dark suy ra,
type scale, radius 10, zero shadow, bộ `ui/` primitive, doodle SVG, Header/Footer.

## Requirements

- Functional: mọi màn sau chỉ ghép primitive, không hand-roll style.
- Non-functional: dark mode đủ tương phản; focus state rõ; cursor-pointer cho control.

## Architecture

`globals.css` khai `@theme` (light) + `:root[data-theme="dark"]` (dark). Component `ui/`
đọc class Tailwind token. Theme toggle lưu `localStorage`, mặc định theo `prefers-color-scheme`.

## Related Code Files

- Create: `apps/web/src/app/globals.css`, `src/lib/theme.ts`
- Create: `apps/web/src/components/ui/{button,tag,card,section-heading,input,skeleton,link-button}.tsx`
- Create: `apps/web/src/components/chrome/{header,footer,theme-toggle}.tsx`
- Create: `apps/web/src/components/doodles/index.tsx`
- Modify: `apps/web/src/app/layout.tsx` (font Inter + Source Serif 4 + Literata)

## Steps

1. `@theme`: ivory/ink/graphite/smoke/ash/slate/sepia/violet/forest/oxblood/margin-yellow.
   Radius 10. Type scale 14/16/20/32/42/48.
2. Dark: canvas `#141210`, text `#f3ede2`, hairline `#2e2a26`, sepia giữ `#512906`, violet `#2b356f`.
3. Primitive: `Button` (filled sepia + ghost), `Tag` (forest/default), `Card`, `SectionHeading`,
   `Input`, `Skeleton`, `LinkButton`.
4. Doodle: 6 SVG nét tay no-fill, vài cái có wash margin-yellow.
5. Header: wordmark trái, nav giữa, ghost auth phải (+ theme toggle).
6. Footer hairline.

## Success Criteria

- [x] Không shadow, radius 10 đồng nhất, radius/token không hardcode rải rác
- [x] Header đúng bố cục 3 vùng; footer hairline
- [x] Dark mode đọc được, CTA sepia vẫn nổi
- [x] Doodle render, không đè lên body copy
