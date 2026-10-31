# Ngọc Lục — Design system

> A bright reading portal in the TruyenYY mould: white blocks on a grey page, one jade-green accent for the action that matters, colourful donghua art.

**Theme:** light-first (default), dark as an option in Tôi. **Platform:** mobile-first web (390px is the design width), desktop ≥1024px adds a slate nav bar and wider grids.

Source of truth for values is `apps/web/src/app/globals.css` (app) and `apps/web/src/lib/reader-themes.ts` (reader). Contrast is enforced by `src/lib/contrast.test.ts` and `src/lib/reader-themes.test.ts` — change a colour, run `pnpm test`.

## Principles

1. **Blocks on a grey page.** Every section is a white `surface` block (`rounded-card`) on the grey `canvas`. Fills inside a block (inputs, chips, skeletons) use `subtle`/`hover`, never `surface`.
2. **One accent, one job.** Green marks the primary action (Đọc tiếp, Tìm, Tiếp ›, active tab/segment, progress fill, section bar). Green as *text* is always `accent-fg`.
3. **Red only for chapter counts.** `hot-fg` is reserved for "Chương N" / số chương; nothing else is red.
4. **Slate for navigation.** `bar` is only for the desktop nav bar, the genre panel and the reader top bar.
5. **Real data only.** No stars, đề cử, VIP, views, comments or rankings — blocks with nothing real to show are hidden.
6. **Everything passes AA.** All text tokens ≥4.5:1 on every surface in both themes; reader body ≥7:1.

## Colour tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `canvas` | `#f0f2f5` | `#111113` | page background |
| `surface` | `#ffffff` | `#18191b` | blocks, cards, header, tab bar |
| `subtle` | `#f7f8fa` | `#212225` | inputs, chips, fills inside a block |
| `raised` | `#ffffff` | `#272a2d` | sheets |
| `hover` | `#eef0f3` | `#2e3135` | hover, secondary button, segment track |
| `line` / `line-strong` | `#e4e6eb` / `#cdd0d5` | `#2e3135` / `#43484e` | hairlines / borders |
| `fg` / `fg-2` / `fg-3` | `#1c2024` / `#60646c` / `#65696f` | `#edeef0` / `#b0b4ba` / `#9a9ea6` | text levels |
| `accent` / `on-accent` | `#15803d` / `#ffffff` | `#22c55e` / `#052e16` | primary fill / text on it |
| `accent-fg` | `#166534` | `#4ade80` | green as text/link (`#15803d` is only 4.47:1 on `canvas`) |
| `accent-soft` | `#dcfce7` | `#12261a` | status badge, current row, avatar |
| `hot-fg` | `#b91c1c` | `#f87171` | chapter counts only (`#dc2626` fails on `canvas`) |
| `bar` / `on-bar` | `#2f3640` / `#ffffff` | `#18191b` / `#edeef0` | slate nav, genre panel, reader top bar |

Slate areas set `--focus-ring: var(--on-bar)`; green focus rings vanish on slate. `coverColor` still exists in the data (crawler) and is only used as the placeholder colour of a cover without an image.

## Typography

| Role | Font | Notes |
|---|---|---|
| UI, body, labels | Be Vietnam Pro 400/500/600/700 | `font-sans` |
| Titles, section headings, nav, chapter title | Roboto Condensed (variable) | `font-heading`; nav is uppercase |
| Reader body | Literata (variable) | `font-read`; loaded only in `(reader)` |

All via `next/font/google` with `subsets: ["latin", "vietnamese"]`. Section heading 18px bold with a 4px green left bar; page H1 24px (30px desktop) with the same bar; card title 15px bold 2-line clamp + author in `fg-2`.

## Shape & spacing

- Radius: cover `4px` (`rounded-cover`), controls `6px` (`rounded-control`), blocks `8px` (`rounded-card`), sheet top `16px` (`rounded-sheet`), chips full.
- Page gutter 16px mobile / 24px desktop; content max 1200px (lists, home), 1000px (detail, mục lục), 760px (tủ truyện), 680px measure (reader).
- Touch targets ≥44px (`min-h-11`); primary CTA 48px. Carousel dots are 24px (WCAG 2.5.8 minimum) — swiping is the main control.

## Layout & navigation

- **Mobile:** sticky white header (wordmark + search icon) + fixed bottom tab bar: Trang chủ · Thể loại · Tủ truyện · Tôi (hidden only on `/dang-nhap`).
- **≥1024px:** header row with search field + green "Tìm" and the user button; below it a non-sticky slate nav: Trang chủ · Thể loại · Mới cập nhật · Truyện full · Tủ truyện. Tab bar hidden.

## Pages

- **Trang chủ (mobile):** carousel → search → Đang đọc → 6 shortcut tiles → "Truyện mới cập nhật" shelf → divider tagline → "Truyện hoàn thành" shelf (≥4 completed).
- **Trang chủ (desktop):** `[slate genre panel | carousel | Đang đọc]` → "Mới cập nhật" text list (title · genre · `Chương N` in `hot-fg` · dd/MM) → "Truyện hoàn thành".
- **Carousel:** `featured` novels (else the 4 newest) over the AI banners; scroll-snap + dots, autoplay 5s, paused on hover/focus/hidden tab, off with reduced motion.
- **Danh sách:** `/danh-sach/moi-cap-nhat`, `/danh-sach/hoan-thanh` (+ `/trang/N`) — `lib/lists.ts`.
- **Trang truyện:** cover left + title/author; info table (Thể loại chips, Trạng thái badge, Số chương red, Cập nhật); buttons "Đọc tiếp chương N" · "DS.Chương" · Theo dõi; Giới thiệu; Chương mới nhất; Truyện cùng thể loại.
- **Reader:** see below.

## Components (where they live)

| Component | File | Notes |
|---|---|---|
| Button / ButtonLink | `components/ui/button.tsx` | `primary` (green), `secondary` (grey), `ghost` (outlined) |
| Tag (chip) | `components/ui/tag.tsx` | green outline; `active` fills green |
| SectionHeading | `components/ui/section-heading.tsx` | green left bar + "Thêm →" |
| EmptyState / Illustration | `components/ui/empty-state.tsx`, `illustration.tsx` | colour spot art in a white block |
| SearchForm | `components/chrome/search-form.tsx` | GET `/tim-kiem?q=`; header, home, search page |
| HeroCarousel / ShortcutGrid / LatestList / GenrePanel | `components/home/*` | home only |
| Shelf | `components/novel/shelf.tsx` | white block, 4 covers/row (8 on desktop) |
| PagedNovelGrid | `components/novel/paged-novel-grid.tsx` | genre + list pages |
| NovelHero / NovelActions | `components/novel/novel-hero.tsx`, `novel-actions.tsx` | detail page |
| LibraryRow | `components/novel/library-row.tsx` | progress + "+N chương mới" badge |
| Reader chrome / ChapterNavPair / settings sheet | `components/reader/*` | top bar slate; rest follows the reader theme |

## Reader

- Themes: Giấy `#F6F3EC/#222222` (default), Ngả vàng `#EFE5D0/#3B3024`, Đêm `#111113/#d8dade`, Đen tuyền `#000000/#b5afa6`; each has a `dim` for chrome text (≥4.5:1).
- Sizes 15 / 16.5 / 18 / 20 / 22 / 24px; line height Hẹp 1.6 · Vừa 1.75 · Rộng 1.95 (never below 1.6 — stacked Vietnamese marks).
- Top bar slate (back, title, chương x/y, mục lục, Aa); bottom bar follows the reader theme (prev, %, next). Both slide with `transform` only; show on open, hide after 3s / on scroll down. 2px green progress hairline.
- Heading: novel name (link) · "CHƯƠNG N" · chapter title in Roboto Condensed bold, centred; "‹ Trước" (outlined) / "Tiếp ›" (green) under the heading and again at the end with "Hết chương N" and the next chapter's title.

## Art

Colourful donghua/xianxia paintings generated with Meshy `gpt-image-2-5-sunburst`, all referenced to one anchor so they share a palette (emerald/jade light):

- `public/art/banner-1..4.webp` (16:9, carousel), `sign-in.webp` (3:4, cropped to 4:3 on the page),
- `public/art/{empty-library,no-results,no-chapters,not-found,error}.webp` (transparent spot art, works on both themes).

Rendered with `next/image` + `unoptimized`: `/_next/image` sits behind the login gate, `/art/` does not. Shortcut icons are Microsoft Fluent Emoji 3D (MIT, licence next to them in `src/assets/shortcuts/`). Prompts, task ids and conversion commands: `plans/20261031-ui-revamp-ngoc-luc/art-prompts.md`; converter: `apps/web/scripts/art-to-webp.mjs`.

## Motion

Transform/opacity only, 200–300ms ease-out; `motion-reduce:transition-none`. Carousel autoplay respects `prefers-reduced-motion`. Like-button and skeleton pulse snippets live in `globals.css`.

## Don'ts

- No raw hex in app chrome (white text over the carousel scrim is the one exception).
- No second accent colour; red never outside chapter counts; slate never as a content background.
- No fake stats, ratings or rankings; hide a block rather than fill it.
- No titles only in `alt`; no icon-only controls without `aria-label`.
- Don't put `outline: none` on focusable things without a visible replacement.
