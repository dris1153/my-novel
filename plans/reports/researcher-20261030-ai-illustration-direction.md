# Research: AI illustration direction

Date: 2026-10-31. No images generated.

## Premise corrections
- Imagen 4 shut down (2026-08-17). Use Nano Banana family: `gemini-3-pro-image` finals (~$0.134/img), `gemini-nano-banana-2.1` exploration (~$0.05, batch $0.025). Avoid `gemini-2.5-flash-image` (shutdown 2027-03-15). Sources: ai.google.dev/gemini-api/docs/imagen, /deprecations.
- Gemini can't output alpha PNG; no seed → not reproducible; SynthID on all outputs. Workaround: generate on flat white, convert to alpha deterministically.

## Candidate styles (analyst ratings)
| | A Ink-wash mono (thủy mặc) | B Flat duotone silhouette | C Painterly xianxia scene | D Line-art + glow |
|---|---|---|---|---|
| 160px empty state | med (one bold motif) | high | low | med |
| Large hero | high | med | high | med |
| One asset dark+light | high (alpha mask × `--ink`) | high | low | low |
| Bytes | low | lowest | high | low |
| AI consistency | med-high | high | low | med |
| Web-novel fit | high | med (generic risk) | high | low (SaaS) |
Rank: A (1) > B (fallback) > C (hero-only later) > D rejected.

## Consistency method
1. One approved style-anchor plate (Pro 2K), attached as style ref to every final.
2. STYLE block verbatim; only SUBJECT + COMPOSITION change.
3. Generate on flat white → deterministic alpha conversion.
4. Commit outputs + exact prompt + model ID + date.

STYLE block:
> Original Chinese ink wash painting (shuimohua) style. Monochrome: pure black ink thinned into soft grey washes, visible brush strokes with dry-brush edges, faint paper grain. Flat pure white background; no colour, no gradient backdrop, no border, no frame. Calm, minimal, premium, contemplative, vast empty negative space. No text, no calligraphy, no seals, no letters, no signature, no human faces. Original composition.

## Per-asset prompts (SUBJECT / COMPOSITION, ratio)
- Sign-in hero [4:5]: lone mountain pavilion on cliff above sea of clouds, thin path to gate, pale crescent moon upper right / subject top 55%, bottom 40% empty.
- Home hero (no continue-reading) [16:9]: layered ridges dissolving into mist, winding river, small boat lower left / subject right 60%, left 40% empty for text.
- Empty library [1:1]: unrolled blank scroll on low table, brush beside, one fallen leaf / centered, ≥70% empty.
- No search results [1:1]: small boat on wide still water, fog swallowing horizon / centered, sparse.
- No chapters [1:1]: closed bamboo scroll tied with cord, upright / centered, ≥70% empty.
- 404 [1:1]: stone path ending at misty cliff edge, one bird circling / path enters lower left.
- Error/offline [1:1]: paper lantern, dimmed flame in wind, bamboo bending / centered.
- Genre motifs [1:1] (optional, later): tiên hiệp floating peak + waterfall; kiếm hiệp river inn + willow + banner (no weapons); huyền huyễn giant lotus in night sky; ngôn tình plum branch over water; đô thị distant towers, one lit window; trinh thám lamp + long shadow over letter; lịch sử ancient gate tower + flag.

## Review checklist (reject on any fail)
No text/seal/faces; monochrome, flat white bg; one motif, ≥60% empty; readable at 160px in ~1s; mid-greys survive conversion on dark+light; matches anchor; genre motifs distinct; alpha present; within size budget.

## Conversion + theming
- Levels → alpha = 255 − luminance, RGB black → WebP with alpha (ImageMagick/sharp script committed).
- CSS: `background-color: var(--ink); mask-image: url(...); mask-size: contain;` (mask-image Baseline since 2023-12). One asset serves both themes; opacity ~0.9 dark / ~0.75 light. Don't use `prefers-color-scheme` (app toggles class).

## Size budget (proposal)
| Asset | Display | Export | Target |
|---|---|---|---|
| Sign-in hero | ≤420w | 1024, 4:5 | 60 KB |
| Home hero | ≤1200w | 1600×900 | 100 KB |
| Empty states ×5 | 120–200 | 512² | 15 KB each |
| Genre chips ×10 (optional) | 48–64 | 256² | 5 KB each |
Hero = LCP → don't lazy-load, `fetchpriority="high"` on one image only.

## Genre tiles
Not worth 10 AI tiles now. Typographic tile + 2–4 real-cover mosaic; optional ink motif chip later.

## Licensing (not legal advice)
Google claims no ownership; paid tier prompts not used for training. AI outputs effectively uncopyrightable (US) — fine for private app. Don't name living artists/IP in prompts. Avoid weapon wording (safety filters).

## Budget
~17 finals × ~6 iterations ≈ 100 generations ≈ $13 (Pro 2K) / $5 (2.1).

## Unresolved
DESIGN.md (light-first) must be replaced given dark-first brief; replace all 6 doodles or heroes only; verify Pro aspect ratios with 1–2 test generations first.
