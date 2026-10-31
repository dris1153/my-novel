# Mây Tím — Design system

> A soft pastel reading room: lavender, peach and sky cards on a warm white page, one indigo accent, a calico cat keeping you company.

**Theme:** light-first (default), dark "tím đêm" as an option. **Platform:** mobile-first web (390px is the design width); desktop ≥1024px adds a left sidebar. Reference mockups: `plans/20261031-ui-may-tim/reference-mockup.png` (home), `mockup-the-loai.png`, `mockup-the-loai-chi-tiet.png`.

**Status:** the app shell, the home page and the genre pages (`/the-loai`, `/the-loai/[slug]`) follow this system. Danh sách and tìm kiếm share the new cover-card grid and genre chips but keep their old headers. Trang truyện, mục lục, tủ truyện, Tôi, đăng nhập, trang trống/lỗi and the reader only inherit the new colours and font so far; they keep their "Ngọc Lục" layout (TruyenYY style, see git history) until their own revamp round.

Source of truth for values is `apps/web/src/app/globals.css` (app) and `apps/web/src/lib/reader-themes.ts` (reader). Contrast is enforced by `src/lib/contrast.test.ts` and `src/lib/reader-themes.test.ts` — change a colour, run `pnpm test`.

## Principles

1. **Cards, not lines.** Sections are rounded cards (`rounded-card`, 24px); pastel tints separate them instead of borders.
2. **One accent, one job.** Indigo marks the active nav item and progress fill. Strong calls to action on art or tint use `ink` (dark pill in light, light pill in dark). Indigo as *text* is `accent-fg`.
3. **Tints have meaning.** Lavender = reading, peach = your library, sky = invitation. Don't scatter them.
4. **Real data only.** No rankings, stars or views. A block with nothing real to show is hidden, and its neighbour takes the row.
5. **Everything passes AA.** All text tokens ≥4.5:1 on every surface and tint in both themes; reader body ≥7:1.

## Colour tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `canvas` | `#fcf8f8` | `#16151f` | page background, hero scrim |
| `surface` / `raised` | `#ffffff` / `#ffffff` | `#1f1e2b` / `#2c2b3c` | white cards, inputs / sheets |
| `subtle` / `hover` | `#f6f2f7` / `#f0ebf6` | `#272636` / `#323145` | fills inside a card / hover, tracks |
| `line` / `line-strong` | `#ece6ef` / `#d9d2e0` | `#323145` / `#4a4860` | hairlines / input borders |
| `fg` / `fg-2` / `fg-3` | `#292942` / `#54526a` / `#5a5870` | `#f1eff8` / `#c0bdd2` / `#b0adc4` | text levels |
| `accent` / `on-accent` | `#3b3dfd` / `#ffffff` | `#8b8dff` / `#14132a` | primary fill / text on it |
| `accent-hover` | `#2f30d0` | `#a5a6ff` | hover of primary fill |
| `accent-fg` / `accent-soft` | `#3032d8` / `#eae6ff` | `#b4b5ff` / `#2a2850` | indigo as text / active pill, avatar |
| `ink` / `on-ink` | `#292942` / `#ffffff` | `#f1eff8` / `#16151f` | strong pill on art or tint |
| `tint-lavender` / `tint-peach` / `tint-sky` | `#e2dffe` / `#feedd7` / `#d8e4fe` | `#2a2850` / `#3a2e22` / `#22304a` | pastel cards |
| `hot-fg` | `#b4235a` | `#ff9db0` | chapter counts on pages not yet revamped |
| `bar` / `on-bar` | `#292942` / `#ffffff` | `#2c2b3c` / `#f1eff8` | reader top bar |

Colours deliberately differ from the mockup where it fails contrast: its meta grey `#a9a7b8` (2.2:1) is `fg-2`, and its pale progress bar (1.4:1) is `accent` on `surface`. Areas where `outline` gets clipped set `--focus-offset` negative; dark fills set `--focus-ring`.

## Typography

| Role | Font | Notes |
|---|---|---|
| UI and headings | Nunito (variable) | `font-sans` and `font-heading` both point to it |
| Reader body | Literata (variable) | `font-read`; loaded only in `(reader)` |

Both via `next/font/google` with `subsets: ["latin", "vietnamese"]`. Home block heading 20px extrabold with an icon; hero title 24 / 32 / 40px extrabold, `text-balance`.

## Shape & spacing

- Radius: card `24px` (`rounded-card`), cover `14px` (`rounded-cover`), controls full (`rounded-control`), sheet top `16px`.
- Page gutter 16px mobile / 24px desktop; home max 1320px.
- Touch targets ≥44px (`min-h-11`). Carousel dots are 24px (WCAG 2.5.8 minimum) — swiping is the main control.

## Layout & navigation

- **<1024px:** sticky header (logo, search icon, avatar → /toi) + fixed bottom tab bar: Trang chủ · Thể loại · Tủ truyện · Tôi (hidden on `/dang-nhap`). Theme is changed on the Tôi page.
- **≥1024px:** left sidebar 180px (`chrome/sidebar.tsx`): logo, Trang chủ · Thể loại · Mới cập nhật · Truyện full · Tủ truyện, mascot, Sáng/Tối switch, gear → /toi. Top bar: search pill, name + avatar → /toi. No tab bar.
- Logged out: no sidebar, no tab bar, logo only. The reader has its own chrome.

## Trang chủ

| Block | Content |
|---|---|
| Banner | 3 slogan slides linking to Mới cập nhật / Truyện full / Thể loại. Scroll-snap, arrows (≥640px), dots, pause; autoplay 5s, paused on hover/focus/hidden tab, stopped by swiping, off with reduced motion |
| Đang đọc (lavender) | Latest novel with progress and "Tiếp tục đọc"; invites to pick a novel when nothing is being read |
| Tủ truyện của bạn (peach) | Followed count, links to `/tu-truyen?tab=theo-doi` |
| Mới cập nhật | 5 cover tiles with the title on a dark scrim; horizontal scroll on phones |
| Cùng nhau đọc truyện nhé! (sky) | Static invitation → `/the-loai`; last on phones |
| Tiếp tục đọc (lavender) | Up to 3 other novels in progress; hidden if none |
| Gợi ý cho bạn | `lib/suggest.ts`: same genres as read/followed novels, excluding them, most shared genres first; hidden if none |

Reading progress beyond the novel's chapter count (novel re-crawled shorter) is not offered, because the link would 404.

## Thể loại

- **`/the-loai`:** lavender header card (title, subtitle, cat reading) + grid of genre cards (2 / 3 / 4 / 5 columns). Each card: the genre's own illustration, name + novel count on a bottom `surface` scrim, two real covers fanned in the corner (≥640px). Genres with novels first.
- **`/the-loai/[slug]`:** header card with the genre illustration on the right behind a left-to-right `canvas` scrim, breadcrumb pill "Thể loại ›", name, count, one-line tagline (`lib/genre-info.ts`; a genre without art/tagline falls back to the plain sky tint), cat mascot (≥1024px). Then genre chips (lavender pills, active = accent) and the cover-card grid with centred pagination.
- **Cover-card grid** (`NovelGrid`, also used by danh sách and tìm kiếm): each novel is a white card (cover, bold title, author), 2 / 3 / 4 / 5 / 6 columns.

## Components (where they live)

| Component | File | Notes |
|---|---|---|
| Sidebar / Header / TabBar / ThemeToggle / UserAvatar | `components/chrome/*` | shell |
| SearchForm | `components/chrome/search-form.tsx` | GET `/tim-kiem?q=`; `withButton` on the search page |
| HeroCarousel, ReadingCard, LibraryCard, CoverTile, PromoCard, ContinueList, HomeHeading | `components/home/*` | home only |
| GenreCard, GenreHeader, GenreListing | `components/genre/*` | genre pages; art + taglines from `lib/genre-info.ts` |
| NovelGrid / NovelGridCard, GenreChips, PageNav | `components/novel/*`, `components/ui/page-nav.tsx` | shared by genre, danh sách, tìm kiếm |
| Button, Tag, SectionHeading, EmptyState, Illustration | `components/ui/*` | older pages; restyle in their round |

## Art

Soft pastel anime illustrations generated with Meshy `gpt-image-2-5-sunburst`, referenced to the approved samples so the girl and the cat stay consistent:

- `public/art/hero-1..3.webp` (16:9, left side kept pale for the title),
- `public/art/{mascot-cat,cat-reading,boy-cat,logo-book}.webp` (transparent),
- `public/art/genres/<slug>.webp` (1200×800, page header) and `<slug>-sm.webp` (600×400, card) for the 10 genres,
- older donghua art still used by pages not yet revamped: `sign-in`, `empty-library`, `no-results`, `no-chapters`, `not-found`, `error`.

Rendered with `next/image` + `unoptimized`: `/_next/image` sits behind the login gate, `/art/` does not. Mascots are generated on flat chroma green and cut with `apps/web/scripts/art-cut-background.mjs`, because Meshy's `remove_background` eats white fur. Prompts, task ids and commands: `plans/20261031-ui-may-tim/art-prompts.md`.

## Don'ts

- No raw hex in app chrome (white text on the dark scrim over covers is the one exception).
- No rankings, ratings or fake stats; hide a block rather than fill it.
- No text on art without a scrim; no titles only in `alt`; no icon-only controls without `aria-label`.
- Don't put `outline: none` on focusable things without a visible replacement.
