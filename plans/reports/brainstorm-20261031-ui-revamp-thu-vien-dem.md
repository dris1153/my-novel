# Brainstorm: UI revamp "Thư viện đêm"

Date: 2026-10-31 | Status: approved → /ck:plan
Mockups: https://claude.ai/artifact/Lt4FUrNdiHWC2knbS2xpLX (A/B/C home + detail, shared reader)
Research: researcher-20261030-novel-platform-ui-patterns.md, researcher-20261030-reader-visual-language.md, researcher-20261030-ai-illustration-direction.md

## Problem
Current "Opennote" UI (ivory paper, serif, sepia CTA, violet panels, hand doodles) feels dated/unprofessional. Want modern, professional, readable, clear web-novel vibe. Full revamp: layout, color, type, art.

## Requirements (user answers)
- Phones primary → mobile-first, bottom tab bar.
- Dark-first, light variant.
- Vibe: blend Webnovel/Qidian + manga reader + Apple Books.
- Art: new AI-generated illustration set.
- Base = direction A (minimal premium) + borrow B (serif headings, genre chips, ink-wash banner) + C (library list w/ progress + new-chapter badges).
- Accent amber #F2B25C. Headings Noto Serif. "+N chương mới" badge: yes, now.

## Evaluated directions
| | A Thư viện đêm | B Tiên hiệp đương đại | C Kệ truyện gọn |
|---|---|---|---|
| Look | slate dark, amber, spacious | ink-blue, cinnabar + gold, serif, banners | #121212, violet, glass, dense |
| + | most readable, calm, cheap to build | strongest genre flavour | best for many followed novels |
| − | can feel plain | loud, more badges to maintain | tool-like, less "truyện" |
Chosen: A base + selected B/C parts.

## Final design
**Tokens**
- Dark: bg #111113, bg-subtle #18191b, surface #212225, raised #272a2d, hover #2e3135, border #2e3135/#363a3f, text #edeef0, text-2 #b0b4ba, text-3 #777b84 (icons/large only), accent #F2B25C, on-accent #1a1206.
- Light: Radix slate light (bg #fcfcfd … text #1c2024, text-2 #60646c); accent fill #F2B25C w/ dark text; accent TEXT/link ≈ #8a5200 (≥4.5:1 on white — verify by script).
- Per-novel `coverColor` (crawl-time sharp dominant, clamped) → radial gradient on detail header + continue card.
- Remove: sepia/violet/forest/oxblood/margin tokens, doodles, 10px-only radius rule.
- Radius: cover 6–8, card 12–16, sheet 20–22, chip pill. Dark elevation = surface step + 1px border.

**Type**: Be Vietnam Pro 400/500/600/700 (UI), Noto Serif 600/700 (headings), Literata variable (reader only). `subsets: ['vietnamese','latin']`.

**Layout**: bottom tab bar (Trang chủ, Thể loại, Tủ truyện, Tôi) <1024px; ≥1024px top nav, no tab bar, 6-col grid. Header: wordmark + search icon. Safe-area insets.

**Pages**
- Home: Đang đọc card | ink-wash banner if none → genre chips → "Mới cập nhật" shelf → "Tất cả truyện" grid (3 col mobile).
- Thể loại: typographic tile + 2–4 real cover mosaic.
- Tìm kiếm: bar + grid.
- Detail: cover-tint header, centered cover, serif title, meta text, genre chips, description expand, latest chapters, sticky bottom (♡ + "Đọc tiếp chương N").
- Mục lục: rows w/ read state, current highlighted, pagination.
- Tủ truyện: list rows (cover, title, "Chương X / Y", progress bar, "+N" badge), sorted by last read.
- Reader: overlay chrome (center tap toggles, hide on scroll down), 2px progress hairline, settings bottom sheet (4 bg themes, size, serif toggle, line spacing NEW), next-chapter card at end. Body Literata 18px, lh 1.75 default.
- Tôi: theme Tự động/Sáng/Tối + sign out. Sign-in/empty/404/error: ink-wash art.

**Art**: 7 monochrome ink-wash assets (sign-in hero, home banner, empty library, no results, no chapters, 404, error) via `gemini-3-pro-image` (+ `gemini-nano-banana-2.1` exploration); one style-anchor plate; white bg → alpha-mask WebP; CSS `mask-image` + `background-color: var(--ink-art)`. Prompts + checklist in AI illustration report. Budget ~$5–13. Commit prompts/model/date with assets.

**Data**
- Crawler: `meta.coverColor` + `index.json` novels[].coverColor; backfill script for existing novels.
- State: `seen: Record<slug, chapterCount>` updated when detail/reader opened; library badge = index.chapterCount − seen.
- Reader prefs add `lineHeight` (localStorage).

**Motion**: transform/opacity only; sheet ~300ms; optional View Transitions cover→detail if Next 16 supports cleanly; prefers-reduced-motion.

## Risks
- Scope touches nearly every component → phase it.
- Light-mode amber contrast; all text ≥4.5:1 → scripted contrast check.
- VN diacritics at lh 1.75 (test ệ ồ ử ặ ẫ ậ).
- AI art drift/no seeds → per-asset review; placeholder fallback.
- `seen` writes add commits → only write when count changed; piggyback on existing throttled writes where possible.
- Needs GEMINI_API_KEY.

## Success criteria
- All pages restyled; no Opennote tokens/doodles left; DESIGN.md rewritten.
- Mobile 390px: no horizontal scroll, touch targets ≥44px, tab bar w/ safe area.
- Contrast AA for all text in dark + light (script).
- Reader: chrome toggle, settings sheet, line-height option; diacritics not clipped.
- Library shows progress + correct "+N" badges.
- typecheck/lint/test/build green.

## Next
/ck:plan (new branch from main after PR #2 merge).
