---
name: contrast-test-blind-spots
description: apps/web contrast.test.ts only checks token×token pairs; hover filters, alpha modifiers, bg-hover, overflow-clipped focus rings and text over art scrims escape it — check manually in UI reviews
metadata:
  type: project
---

`apps/web/src/lib/contrast.test.ts` compares hex tokens from `globals.css` only (TEXT × canvas/subtle/surface/raised + a few named pairs). It cannot see:
- `hover:brightness-*` filters (sRGB math): with white `on-accent` (Ngọc Lục, 2026-10-31) `brightness-110` dropped #15803d to 4.27:1.
- Tailwind alpha modifiers (`text-on-bar/70`), and the `hover` token as a background.
- Focus rings: global `:focus-visible` uses `outline-offset: 2px`, so links filling an `overflow-*` container (carousel, scroll panels) lose the ring entirely.

- Text over art behind `from-surface`/`from-canvas` scrims (genre cards/header, Mây Tím). Measure it: Python has PIL but no numpy, so a pure-Python script works (object-cover crop → alpha-composite the token per pixel → WCAG per pixel, report p10/min, both themes). Dark theme is always the weak side.

- Scrim padding per breakpoint: novel-hero (2026-10-31) faded its gradient from `sm:` but reserved right padding only at `xl:` — dark text at sm–lg sat on raw art (min ~1:1). Run the measuring script at every breakpoint.
- Negative `--focus-offset` draws the ring INSIDE the element: on `bg-accent` buttons accent-fg ring is 1.27:1 light / 1.5:1 dark. Needs `[--focus-ring:var(--on-accent)]` (hero-carousel pattern).
- `lib/cn.ts` is a plain join (no tailwind-merge): `className` overrides of a same-property utility (e.g. `bg-fg/10` vs variant `bg-tint-lavender`, `font-bold` vs base `font-semibold`) win/lose by CSS order — grep `.next/dev/static/css/app/layout.css` to verify.

**Why:** these were the main misses in the 2026-10-31 UI revamp review; the test was green while real pairs failed.
**How to apply:** in any apps/web UI review, recompute hover/alpha pairs with a quick node WCAG script and check every focusable child of overflow containers / slate (`bg-bar`) areas.
