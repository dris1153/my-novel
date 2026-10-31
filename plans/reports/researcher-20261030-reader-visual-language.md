# Research: reader visual language (manga/manhwa + e-book apps)

Date: 2026-10-30. Values marked [calc] = hand-computed contrast (re-verify by script); [memory]/[unverified] = primary page not rendered.

## Ranked recommendations
1. Dark base = Radix slate dark scale (verified, MIT). Never #000 default; OLED black = opt-in reader toggle.
2. Cover color = dominant hex at crawl time (sharp `stats().dominant`, resize ~64px first), stored in meta, used as gradient on detail header + continue card. No runtime canvas.
3. Type = Be Vietnam Pro (UI) + Literata (reader). Fallback Source Serif 4. VI subsets verified via Google Fonts API.
4. Motion = same-document View Transitions (Baseline since 2025-10) card→detail; transform/opacity only; reduced-motion respected.
5. Glass optional, non-text chrome only (iOS 26 Liquid Glass backlash: contrast down to 1.5:1).

## Tokens
Radix slate dark (raw: github.com/radix-ui/colors src/dark.ts): 1 #111113, 2 #18191b, 3 #212225, 4 #272a2d, 5 #2e3135, 6 #363a3f, 7 #43484e, 8 #5a6169, 9 #696e77, 10 #777b84, 11 #b0b4ba, 12 #edeef0.
Radix slate light: 1 #fcfcfd, 2 #f9f9fb, 3 #f0f0f3, 4 #e8e8ec, 5 #e0e1e6, 6 #d9d9e0, 7 #cdced6, 8 #b9bbc6, 9 #8b8d98, 10 #80838d, 11 #60646c, 12 #1c2024.

| Token | Dark | Light | Use |
|---|---|---|---|
| bg | #111113 | #fcfcfd | canvas |
| bg-subtle | #18191b | #f9f9fb | sections |
| surface | #212225 | #f0f0f3 | cards/rows |
| surface-raised | #272a2d | #ffffff | sheets/menus |
| hover/pressed | #2e3135/#363a3f | #e8e8ec/#e0e1e6 | states |
| border | #363a3f | #d9d9e0 | hairlines |
| border-strong | #43484e | #cdced6 | inputs |
| text | #edeef0 (~16:1) | #1c2024 | titles/body |
| text-2 | #b0b4ba (~9:1) | #60646c (~5.9:1) | meta |
| text-3 | #777b84 (~4.4:1, large only) | #80838d (~3.7:1) | icons/disabled |
| accent | TBD, ≥4.5:1 as text | | CTA/progress |

Dark elevation = surface steps + 1px border, not shadows.

Reader themes: paper #F6F3EC/#222222 (~14:1), sepia #EFE5D0/#3B3024 (~10:1), night #111113/#d8dade (~13:1), OLED = night with #000.

## Cover-driven color
- Verified precedent: Komikku "auto theme color based on cover".
- Rank: crawl-time sharp dominant (zero client cost) > client fast-average-color (CORS + per-view) > node-vibrant > CSS blur of full cover (avoid).
- Render: radial gradient from stored color fading to bg; clamp lightness; store dominant + clamped tint.

## Radius / density (judgment)
Covers 6px, cards 12px, sheet top 20–24px, chips pill. Mobile 3-col grid at 360–430px, gap 8–10px, 2-line title clamp. Drop doodles + serif display from chrome; serif only in reader body.

## Library
- Continue hero: cover 96–120px, title, "Chương 1234/1890 · 42%", 3px progress bar, CTA.
- Grid default: 2px progress on cover bottom, unread pill (99+ cap), new-chapter dot. List toggle optional.
- Chapter index primary, percent secondary.

## Reader UX
- Scroll mode default; center tap toggles chrome; hide on scroll down, show on scroll up; 2px progress hairline always.
- Settings sheet: live preview → Themes / Font / Layout.
- Footer "Chương 1234 · 42%"; chapter end = next-chapter card.
- Measure: phone full-bleed (~40–45 chars at 17px), cap ~70ch tablet/desktop (Butterick 45–90).
- Line height default 1.75 (range 1.5–2.0), paragraph gap 1em, no indent. WCAG 1.4.12 must not clip. Test sample: "Tiếng Việt rất đẹp", ệ ồ ử ặ ẫ ậ.

## Vietnamese fonts (Google Fonts API probe)
| Font | VI | Axes | Verdict |
|---|---|---|---|
| Be Vietnam Pro | yes | static | UI #1 (VI-adaptive diacritics) |
| Literata | yes | opsz, wght 200–900 | Reader #1 |
| Source Serif 4 | yes | opsz, wght | Reader #2 |
| Manrope / Plus Jakarta Sans / Inter | yes | wght | UI alternates |
| Noto Serif | yes | wdth, wght | Reader #3 safe |
| Lexend / Lora / Merriweather | yes | | skip for body |

Pairings: A Be Vietnam Pro + Literata (rec), B Manrope + Source Serif 4, C Inter + Noto Serif. `subsets: ['vietnamese','latin']`; reader serif only on reader route; NFC-normalize text at crawl.

## Motion
- Same-document View Transitions baseline (web.dev 2025-10-14); `view-transition-name` only on tapped cover.
- Sheets transform/opacity 300–350ms, curve cubic-bezier(0.32,0.72,0,1). Never animate blur/shadow/width.
- Next 16 view-transition wiring unverified → check node_modules/next/dist/docs.

## Anti-patterns
#000 default bg, #FFF text on dark, step-10 gray body text, glass behind text, runtime canvas sampling, full-size blurred cover bg, shadow elevation on dark, lh <1.5 for VN, measure >90ch, Lexend/Lora/Merriweather body.

## Unresolved
Accent hue; serif in chrome?; scroll vs page default; Next 16 view-transition wiring; cover-color backfill; Be Vietnam Pro weights (400/500/600/700).
