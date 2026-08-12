---
title: "Redesign UI theo Opennote (re-tokenize)"
status: completed
scope: project
created: 2026-08-12
source: plans/reports/brainstorm-20260812-opennote-redesign.md
demo: docs/wireframe/opennote.html
blockedBy: []
blocks: []
---

# Redesign UI theo Opennote

Áp design system Opennote lên **chrome + admin**. Reader (4 theme + Literata @1.8 + app dark
mode) GIỮ NGUYÊN. Nguồn: [brainstorm](../reports/brainstorm-20260812-opennote-redesign.md) +
demo đã duyệt [opennote.html](../../docs/wireframe/opennote.html).

## Nguyên tắc

Sepia #512906 = CTA duy nhất. Ink-violet #242d64 = một feature panel/trang. Forest #0c3b1a =
tag/trạng thái. 10px radius, hairline #e5e5e5, zero shadow. Serif (Source Serif 4) ở tiêu đề,
Inter ở UI. Bỏ margin-yellow.

## Điểm KHÔNG cơ học (phải làm tay)

1. **Font swap có ngữ nghĩa**: chrome đang dùng Be Vietnam Pro (sans) cho MỌI text. Opennote
   muốn serif ở tiêu đề. Phải thêm role `FontFamily.serif*` và đổi các title element
   (tên truyện, section heading, screen title, hero title) từ `uiBold/uiSemi` → serif.
2. **Hero sienna → ink-violet panel**: `[slug].tsx` hero `#2C1810` và home hero đổi cấu trúc,
   không chỉ đổi màu.
3. **Link xanh sót**: `themed-text.tsx` `linkPrimary #3c87f7` vi phạm Opennote → sepia/ink.

## Phases

| # | Phase | Trạng thái | Deliverable |
|---|-------|-----------|-------------|
| 1 | [Mobile re-tokenize](phase-01-mobile-tokens-fonts.md) | ✅ done | Chrome Opennote; reader/dark/4-theme intact; typecheck + lint sạch |
| 2 | [Admin re-tokenize](phase-02-admin-tokens.md) | ✅ done | Admin Opennote; @theme + Inter/Source Serif; build sạch |
| 3 | [Verify](phase-03-verify.md) | ⚠ 1 phần | typecheck/test/export/build pass; render tiếng Việt cần user eyeball |

Phase 1 và 2 độc lập (2 app khác nhau). Phase 3 verify sau cả hai.

## Deps mới

`@expo-google-fonts/source-serif-4@0.4.1`, `@expo-google-fonts/inter@0.4.2` (mobile).
Admin dùng `next/font/google` Source_Serif_4 + Inter, không thêm npm dep.

## Success criteria

- [ ] Chrome (home, chi tiết, tìm kiếm, tủ truyện) + admin mang thẩm mỹ Opennote
- [ ] Reader: 4 theme, Literata @1.8, app dark mode — KHÔNG một thay đổi nào
- [ ] Không còn hex xanh/tím SaaS sót (#3c87f7) hay margin-yellow trên chrome
- [ ] `pnpm typecheck` sạch, `pnpm test` pass, web export 9 route
- [ ] Render tiếng Việt đúng với Source Serif 4 + Inter (dấu không vỡ)
