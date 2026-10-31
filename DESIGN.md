# Thư viện đêm — Design system

> A night library: quiet near-black shelves, covers as the only real colour, one warm amber lamp for the action that matters.

**Theme:** dark-first (default), light variant. **Platform:** mobile-first web (390px is the design width), desktop ≥1024px is an expansion.

Source of truth for values is `apps/web/src/app/globals.css` (app) and `apps/web/src/lib/reader-themes.ts` (reader). Contrast is enforced by `src/lib/contrast.test.ts` and `src/lib/reader-themes.test.ts` — change a colour, run `pnpm test`.

## Principles

1. **Covers carry the colour.** Chrome is neutral slate; a novel's cover (and its `coverColor`, computed at crawl time) tints the detail header and the "Đang đọc" card. Nothing else is decorative colour.
2. **One accent, one job.** Amber `#F2B25C` marks the primary action of a screen (Đọc tiếp, Tìm, active tab, progress fill). Never two amber buttons on one screen.
3. **Reading comes first.** The reader has its own palette (4 backgrounds), Literata body, user-controlled size and line height. Chrome floats over text and never reflows it.
4. **Text is never hidden in images.** Every cover shows its title below it; status and counts are text, not pills.
5. **Everything passes AA.** All text tokens ≥4.5:1 on every surface in both themes; reader body ≥7:1.

## Colour tokens

| Token | Dark | Light | Use |
|---|---|---|---|
| `canvas` | `#111113` | `#fcfcfd` | page background |
| `subtle` | `#18191b` | `#f9f9fb` | section / card base |
| `surface` | `#212225` | `#f0f0f3` | cards, rows, inputs, chips |
| `raised` | `#272a2d` | `#ffffff` | sheets, selected segment |
| `hover` | `#2e3135` | `#e8e8ec` | hover / pressed |
| `line` | `#2e3135` | `#d9d9e0` | hairlines |
| `line-strong` | `#43484e` | `#cdced6` | ghost-button borders |
| `fg` | `#edeef0` | `#1c2024` | titles, body |
| `fg-2` | `#b0b4ba` | `#60646c` | meta, secondary |
| `fg-3` | `#9a9ea6` | `#65696f` | tertiary (still AA) |
| `accent` | `#f2b25c` | `#f2b25c` | primary fill |
| `on-accent` | `#1a1206` | `#1a1206` | text on accent |
| `accent-fg` | `#f2b25c` | `#8a5200` | amber as text/link (light needs the dark amber) |
| `accent-soft` | `#2a2116` | `#fbefd9` | avatar / soft highlight |

Elevation on dark = next surface step + 1px `line` border. Shadows only under covers.

### Cover colour
`coverColor` = sharp dominant colour of the cover, clamped to HSL lightness 0.25–0.5 and saturation ≤0.6 (`packages/crawler/src/cover-color.ts`), so a gradient of it never breaks text contrast. Used as `radial-gradient(<color> ~55–75% → transparent)` over `canvas`/`subtle`. Missing → `#3b4f6b`.

## Typography

| Role | Font | Notes |
|---|---|---|
| UI, body, labels | Be Vietnam Pro 400/500/600/700 | `font-sans`; designed for Vietnamese diacritics |
| Titles (novel names, section headings, page H1) | Noto Serif 600/700 | `font-serif`; the "truyện" voice |
| Reader body | Literata (variable) | `font-read`; loaded only in `(reader)` |

All loaded via `next/font/google` with `subsets: ["latin", "vietnamese"]`. Section heading 20px serif semibold; page H1 24px (30px desktop) serif bold; card title 15px serif semibold, 2-line clamp; meta 12–13px `fg-2`.

## Shape & spacing

- Radius: cover `6px` (`rounded-cover`), card `14px` (`rounded-card`), sheet top `22px` (`rounded-sheet`), buttons/inputs `12px` (`rounded-xl`), chips full.
- Page gutter 16px mobile / 24px desktop; content max 1200px (lists), 760px (detail, library), 680px measure (reader).
- Touch targets ≥44px (`min-h-11` / `size-11`); primary CTA 52px.

## Layout & navigation

- **Mobile:** sticky header (wordmark + search icon) + fixed bottom tab bar: Trang chủ · Thể loại · Tủ truyện · Tôi. Active tab = amber + semibold + `aria-current`. Tab bar hidden on `/dang-nhap` and the novel detail page (which has its own fixed action bar).
- **≥1024px:** nav moves into the header, tab bar hidden, grids go to 6 columns.

## Components (where they live)

| Component | File | Notes |
|---|---|---|
| Button / ButtonLink | `components/ui/button.tsx` | `primary` (amber), `ghost`, `quiet` |
| Tag (chip) | `components/ui/tag.tsx` | pill; `active` inverts to `fg` on `canvas` |
| SectionHeading | `components/ui/section-heading.tsx` | serif title + optional "Xem tất cả" |
| EmptyState | `components/ui/empty-state.tsx` | illustration + title + text + action |
| InkScene | `components/ui/ink-scene.tsx` | placeholder ink-wash scene (see Art) |
| NovelCover / NovelGridCard / NovelGrid | `components/novel/novel-cover.tsx`, `novel-card.tsx` | 2:3 cover, title always visible |
| Shelf | `components/novel/shelf.tsx` | horizontal snap scroller |
| ContinueReading | `components/novel/continue-reading.tsx` | cover-tinted card with progress |
| GenreTile | `components/novel/genre-tile.tsx` | serif name + count + fanned real covers |
| LibraryRow | `components/novel/library-row.tsx` | progress + "+N chương mới" badge |
| Reader chrome / settings sheet | `components/reader/*` | colours follow the reader theme |

## Reader

- Themes: Giấy `#F6F3EC/#222222`, Ngả vàng `#EFE5D0/#3B3024`, Đêm `#111113/#d8dade` (default), Đen tuyền `#000000/#b5afa6`; each has a `dim` for chrome text (≥4.5:1).
- Sizes 15 / 16.5 / 18 / 20 / 22 / 24px; line height Hẹp 1.6 · Vừa 1.75 · Rộng 1.95 (never below 1.6 — stacked Vietnamese marks).
- Chrome: top bar (back, title, chapter x/y, TOC, Aa) + bottom bar (prev, %, next), fixed and translucent, slide with `transform` only. Shows on open, hides after 3s or on scroll down, shows on scroll up / near top / tap on text. 2px amber progress hairline always visible.
- End of chapter: "Hết chương N" card with the next chapter as the single amber action.

## Art

Monochrome ink-wash (thủy mặc) scenes with large negative space: `apps/web/public/art/*.webp` (sign-in, home-banner, empty-library, no-results, no-chapters, not-found, error). Each file is an alpha mask (alpha = ink density) rendered by `InkArt` (`components/ui/ink-art.tsx`) as `background-color: var(--ink-art)` + `mask-image`, so one file serves both themes. Art is decorative (`aria-hidden`) and always paired with text. `/art/` is the only public path exempt from the login gate (the sign-in page needs it). Provenance, prompts and conversion commands: `plans/20261031-ui-revamp-thu-vien-dem/art-prompts.md`; converter: `apps/web/scripts/ink-to-mask.mjs`.

## Motion

Transform/opacity only, 200–300ms ease-out; `motion-reduce:transition-none`. Like-button and skeleton pulse snippets live in `globals.css` and respect `prefers-reduced-motion`.

## Don'ts

- No glass/blur behind text; no glow; no gradients except cover tints.
- No second accent colour, no coloured status pills, no fake stats or rankings.
- No titles only in `alt`; no icon-only controls without `aria-label`.
- Don't put `outline: none` on focusable things without a visible replacement (`focus-within` border counts).
