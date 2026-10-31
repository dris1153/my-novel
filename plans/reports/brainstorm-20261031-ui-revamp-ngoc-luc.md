# Brainstorm: UI revamp "Ngọc Lục" (TruyenYY layout, green primary)

Date: 2026-10-31 | Status: approved → /ck:plan
Supersedes the visual layer of `brainstorm-20261031-ui-revamp-thu-vien-dem.md`; data model, state (`seen`, progress), reader mechanics stay.
Reference captures (session scratchpad, temporary): `…/scratchpad/ref/truyenyy/{home,detail,chapter}-{390,1440}-{top,full}.png` + `home.json`, `detail.json`.

## Problem
"Thư viện đêm" (dark, amber, ink-wash) is done, but user wants the app to follow truyenyy.co: its layout and how it uses colour, with primary blue → green, and art in the same colourful style.

## Requirements (user answers)
- Follow truyenyy.co layout + colour usage; primary blue → green.
- Light-first; dark kept as an option.
- Mobile keeps the bottom tab bar (no TruyenYY blue icon bar on top).
- Real data only: drop stars, đề cử, VIP, views, comments, rankings/"Top tuần", app promo.
- Art: colourful donghua/xianxia set via Meshy `gpt-image-2-5-sunburst`; replaces ink-wash masks. Approved ~130 credits (+~40 rerolls) of 423.
- Shortcut icons: Microsoft Fluent Emoji (MIT).
- Never copy TruyenYY logo, branding or images.

## Reference: truyenyy.co (captured 2026-10-31)
- Light: page bg #EDEDED/#F4F4F4, white blocks. Desktop: white header (logo, search, user) + dark slate nav #343A40; dark genre panel beside the carousel.
- Colour usage: one primary (#3684F7) for CTA, links, active, section bar; red #F5222D only for chapter counts; grey secondary buttons.
- Type: Roboto Condensed for titles/nav/headings; system sans body; serif chapter text. Radius 8px blocks, 4px covers/buttons, pills full.
- Mobile home: top icon bar → hero carousel (colourful donghua art) → search box → 6 colourful shortcut tiles → sections (primary left bar + "Thêm →") with 4-per-row covers (bold 2-line title + grey author) → divider tagline → "Top Tuần" tabs → footer.
- Detail: cover left + title/author/stars/badge; buttons "Đọc Từ Đầu" (primary), "DS.Chương" (grey), "Mua Chương VIP" (yellow), "Lưu Tủ Sách"; info table (Thể loại/Trạng thái/Số chương/Cập nhật); intro with expand; stat chips; latest chapters; related-genre shelf.
- Reader: dark slate top bar (back, logo, menu); big condensed bold chapter title; "‹ Trước" grey / "Tiếp ›" primary at top and bottom; serif body.

## Evaluated approaches
| | 1. Clone 1:1 | 2. Re-skin only | 3. Layout + colour, real data (chosen) |
|---|---|---|---|
| What | TruyenYY layout incl. top icon bar, ranks, footer | swap tokens/fonts, keep current layouts | TruyenYY structure mapped to our data; keep tab bar, reader sheet, state |
| + | closest look | smallest diff | matches the ask without fake data |
| − | fake/empty blocks, loses tab bar | doesn't follow the layout | touches most components |

## Final design

### Tokens
| Token | Light (default) | Dark |
|---|---|---|
| canvas (page) | #F0F2F5 | #111113 |
| surface (blocks/cards) | #FFFFFF | #18191B |
| subtle (inputs, zebra rows) | #F7F8FA | #212225 |
| raised (sheet/menu, shadow) | #FFFFFF | #272A2D |
| hover | #EEF0F3 | #2E3135 |
| line / line-strong | #E4E6EB / #CDD0D5 | #2E3135 / #43484E |
| fg / fg-2 / fg-3 | #1C2024 / #60646C / #65696F | #EDEEF0 / #B0B4BA / #9A9EA6 |
| accent (fill) | #15803D | #22C55E |
| on-accent | #FFFFFF (5.0:1) | #052E16 (6.5:1) |
| accent-fg (text/links) | #166534 (6.4:1 on canvas) | #4ADE80 |
| accent-soft (chips, active rows) | #DCFCE7 | #12261A |
| hot-fg (chapter counts only) — new | #B91C1C (5.8:1 on canvas; #DC2626 only 4.3:1 on grey) | #F87171 |
| bar / on-bar (desktop nav, reader top bar) — new | #2F3640 / #FFFFFF (12:1) | #18191B / #EDEEF0 |

- Green as text never uses #15803D on grey (4.47:1 on #F0F2F5, fails) → always `accent-fg`.
- Remove `--ink-art`, `--tint-card`, `--tint-hero`, `tint.test.ts`. `coverColor` stays in data/crawler, unused by UI.
- Radius: cover 4px, card 8px, controls 6px, sheet 16px, chips pill. Light elevation = white block on grey; shadow only on raised.
- Values hand-computed → contrast.test.ts must cover every new pair (hot-fg, bar/on-bar, accent pairs) in both themes.

### Type
- Roboto Condensed (variable, `vietnamese` subset) → `--font-heading`: novel titles, section headings, nav, chapter title.
- Be Vietnam Pro body (unchanged); Literata reader body (unchanged). Drop Noto Serif.

### Chrome
- Theme default light (`ThemeProvider defaultTheme="light"`); picker keeps Tự động/Sáng/Tối; viewport themeColor light.
- Mobile (<1024px): white header (wordmark + search icon); bottom tab bar unchanged in function, active = accent-fg; tab bar now also shows on `/truyen/[slug]`.
- Desktop (≥1024px): white header row (wordmark, search field + green button, auth slot) + slate nav bar (Trang chủ, Thể loại, Mới cập nhật, Truyện full, Tủ truyện); active item green.

### Pages
- **Home mobile:** carousel → search box (form → /tim-kiem) → continue-reading card (if any) → 6 shortcut tiles → "Truyện mới cập nhật" (4-col, 8, "Thêm →") → divider tagline → "Truyện hoàn thành" (`status === "completed"`, hidden if too few).
- **Home desktop:** row [slate genre panel with counts | carousel | continue-reading] → "Mới cập nhật" text list (title · genre · chapter count in hot-fg) beside "Chọn lọc" (cover, title, author, chapter count, description excerpt) → "Truyện hoàn thành" grid.
- **Carousel:** slides = `featured` novels, else top 4 recent. Each slide = AI banner (cycled) + scrim + cover thumb + title + genre + "Đọc ngay" → /truyen/[slug]. CSS scroll-snap + dots; autoplay 5s, paused on hover/focus/hidden tab, off under reduced-motion; keyboard reachable. No library. Only first image priority.
- **Shortcut tiles:** Mới cập nhật → /danh-sach/moi-cap-nhat; Truyện full → /danh-sach/hoan-thanh; Thể loại → /the-loai; Đang đọc → /tu-truyen?tab=dang-doc; Tủ truyện → /tu-truyen?tab=theo-doi; Tìm kiếm → /tim-kiem.
- **New list pages:** /danh-sach/[kind] (+ /trang/[page]) for `moi-cap-nhat` | `hoan-thanh`; same pagination pattern and NovelGrid as genre pages. Home "Tất cả truyện" grid removed.
- **Detail:** white block; cover left + condensed title + author + status badge + genre chips (green outline); buttons: primary "Đọc tiếp chương N"/"Đọc từ đầu", grey "DS.Chương" (→ mục lục), "Theo dõi". Info table: Thể loại / Trạng thái / Số chương (hot-fg) / Cập nhật. Intro (DescriptionAccordion). Latest chapters (number + title; no per-chapter time in data). "Truyện cùng thể loại" shelf (first genre, exclude self, 8). Remove fixed NovelActions bar and cover-tint hero.
- **Mục lục:** white block rows, 2 cols desktop, current chapter highlighted, pagination.
- **Thể loại:** list/tiles with counts (like the slate panel); genre page = grid + pagination.
- **Tìm kiếm:** big search field + grid.
- **Tủ truyện:** segmented tabs (Đang đọc / Theo dõi, green active); rows keep progress bar + "+N" badge.
- **Tôi:** white blocks; theme picker + sign out.
- **Reader:** slate top bar (auto-hide + pin-on-focus kept); condensed bold chapter title; "‹ Trước" grey / "Tiếp ›" green pair under the title and at the end (end "Tiếp" may carry the next title; replaces NextChapterCard). Settings sheet restyled. Reader background themes unchanged (re-run reader-themes.test).
- **Sign-in / empty / 404 / error:** new colour art; white block.

### Art (Meshy `gpt-image-2-5-sunburst`)
STYLE block (verbatim in every prompt): vibrant Chinese donghua xianxia fantasy digital painting, rich saturated jewel tones with emerald/jade highlights, luminous spiritual light, cinematic lighting, detailed environment, distant small figures in flowing robes with faces not visible, original composition; no text, no letters, no logo, no watermark, no UI, no recognizable characters.

| Asset | Ratio | Method | Credits |
|---|---|---|---|
| 2 banner style samples (user picks anchor; both usable as banners) | 16:9 | text-to-image | 18 |
| 2–3 more banners | 16:9 | image-to-image, anchor ref | 24–36 |
| Sign-in | 3:4 | image-to-image | 12 |
| 5 spots: empty-library, no-results, no-chapters, not-found, error | 1:1 | image-to-image, `remove_background` | 60 |
Total ≈ 114–126; cap 170 incl. rerolls. Meshy rule: on timeout/5xx check `meshy_list_tasks` before re-creating.

- PNG → WebP (sharp): banners 1600×900 ≤150 KB, sign-in 900×1200 ≤120 KB, spots 512² ≤40 KB.
- Files in `apps/web/public/art/` (gate exempts `art/`; sign-in needs it pre-login).
- Delete ink-wash webps, `scripts/ink-to-mask.mjs`, mask-based `InkArt`; replace with a plain image component (transparent spots work on both themes).
- Record prompts, model, date, task ids in the plan's `art-prompts.md`.

### Icons
Fluent Emoji 3D PNG (github.com/microsoft/fluentui-emoji, MIT): 🆕 Mới cập nhật, 🏆 Truyện full, 📚 Thể loại, 📖 Đang đọc, 🔖 Tủ truyện, 🔍 Tìm kiếm. 256px → WebP, static import; licence noted in art provenance.

## Out of scope
Ratings/stars, đề cử, VIP, views, comments, rankings, app promo, footer link grid, TruyenYY branding/assets.

## Risks
- Contrast: hand-computed values → enforce in contrast.test.ts before restyling components.
- Roboto Condensed + Vietnamese stacked marks at tight leading → test "Ẩn Ước Kiếm Tiên Ệ Ồ Ử" in headings.
- AI art drift / Meshy failures → anchor-referenced generation, per-asset review, keep CSS gradient placeholder until art lands; stop at 170 credits.
- Carousel a11y/perf: autoplay rules above; slides are links, not hidden from keyboard.
- Colourful spots on dark theme can glare → transparent bg, modest size.
- Diff touches nearly every component → phase it; tests green each phase.
- Light-first: users whose stored theme is "system" may now see light; acceptable.

## Success criteria
- 390px and 1440px screenshots of home, detail, reader follow the structure above.
- No leftovers: grep `ink-art`, `F2B25C`, `Noto_Serif`, `tint-card` → none.
- AA contrast for all text pairs, light + dark (tests).
- 390px no horizontal scroll; touch targets ≥44px; carousel works by swipe + keyboard; reduced-motion stops autoplay.
- Art: ≥4 banners, sign-in, 5 spots, 6 icons; total art ≤ ~900 KB; Meshy spend ≤170 credits.
- typecheck/lint/test/build green; DESIGN.md, AGENTS.md (colour + art gotchas) rewritten.

## Next
/ck:plan → branch `feat/ui-ngoc-luc` from main.
