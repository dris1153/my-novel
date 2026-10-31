# Research: web-novel platform UI patterns (mobile-first, dark-first VN reader)

Date: 2026-10-31. Sources tagged: [OFF] official, [3P] third-party reverse-engineered, [SNAP] text snapshot of live page, [SRCH] search snippet.

## Coverage
- Reached: m.qidian.com [SNAP], fanqienovel.com [SNAP], wattpad.com [SNAP], tapas.io [SNAP], Ridi + KakaoPage DESIGN.md (github.com/kwakseongjae/oh-my-design) [3P], Wuxiaworld reader help [OFF], Kototoro novel-reader notes (kototoro-app.github.io) [3P], MoboReader walkthrough (screensdesign.com) [3P], Material dark/bottom-nav docs [OFF], WCAG 1.4.8 [OFF].
- Blocked/down: webnovel.com (403), royalroad.com (403), truyenfull (521), tangthuvien (522), wikidich (DNS), metruyencv (closed notice; had Ngày/Đêm/Tự động switch).
- VN reader UX + Webnovel/Royal Road unverified → needs browser capture if important.

## Concrete values
| Token | Value | Source |
|---|---|---|
| App dark surface | #121212 | Material [OFF] |
| Reader night bg/text | #1A1A1A / #D8D8D8 (~12:1) | Ridi [3P] |
| Reader sepia bg | #F4ECD8 | Ridi [3P] |
| Reader body | 17–22px, lh 1.7, measure ~36em | Ridi [3P] |
| Cover | 2:3, 4–8px radius, soft shadow | Ridi/Kakao [3P] |
| Genre chip | pill 13px/500, active inverted | Ridi [3P] |
| Reader margins | phone 16–20px (Kototoro default 36dp too wide) | Kototoro [3P] |
| Bottom nav | 3–5 items, icon + label | Material [OFF] |
| Meta gray | ≥4.5:1 (Ridi #9D9D9D = 2.7:1, don't copy) | WCAG |

## Patterns worth stealing (ranked)
1. Reader overlay chrome: bars overlay text (no reflow), tap-center toggles, auto-hide ~3s, 2px progress bar [Ridi, Kototoro, MoboReader].
2. One reader settings bottom sheet with live preview (theme swatches, size, line height, font, margins) [MoboReader, Ridi].
3. Reader typography: 17–18px phone, lh ~1.7 (test 1.6–1.8 with VN stacked marks), measure ≤36em, phone margins 16–20px.
4. Home: "Đọc tiếp" card first → ≤4 horizontal shelves → 3-col grid (<480px). No promo carousel.
5. Detail: 2:3 cover, title, status/chapter count as text, genre chips, synopsis expand, pinned bottom CTA "Đọc tiếp chương N" (single accent) [MoboReader, KakaoPage].
6. Palette: near-black base, single accent only on primary CTA + active state, never pure #FFF text on dark.
7. Bottom tab bar 4 items (Trang chủ, Thể loại, Tủ truyện, Tôi) + search icon in header.
8. Chapter list rows: number + title + read state, current chapter highlighted.
9. Covers 2:3, 4–8px radius, layered soft shadow, title visible under cover (overlay only with scrim).
10. Status/meta as text, max one badge per card.
11. Skeletons sized to final layout.
12. Motion: no bounce in reader, chrome slide 200–300ms, honor reduced-motion.

## Anti-patterns
- Settings split across places / icon-only font controls.
- Dark mode only inside reader (users want app-wide).
- Overloaded home (14 shelves, 7-icon grids, promo strips).
- Cover-only cards (title only in alt text).
- Low-contrast meta gray.
- Fake stats/rankings (app has none) → use "Mới cập nhật".
- Reader bloat (audio, auto-scroll, nudges, tutorials).
- Chrome that reflows text when toggled.

## Dated vs modern
- Dated: top-nav dropdowns, 10+ shelves, ranks everywhere, many colored badges, tutorial overlays, side drawers.
- Modern: bottom tab bar, bottom-sheet settings w/ preview, auto-hide chrome, follow-system theme w/ manual override, cover art as only color, per-user sync.

## Fit notes
- Theme via `data-theme`/class on `<html>` + CSS vars in `@theme inline`; reader themes scoped to reader wrapper.
- `next/font/google` must include `vietnamese` subset; scope reader fonts to reader layout.
- Fixed chrome with `env(safe-area-inset-*)`, `dvh`.

## Unresolved
1. Browser capture of VN sites/Webnovel at 390px (blocked for plain fetch).
2. Line-height test 1.6/1.7/1.8 with chosen font.
3. Accent color brand decision + contrast check.
4. Replace DESIGN.md.
