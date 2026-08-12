---
phase: 3
title: "Verify"
status: pending
priority: P2
effort: "1.5h"
dependencies: [1, 2]
---

# Phase 3: Verify

## Overview

Kiểm chứng redesign không phá build/reader/tiếng Việt. Lần trước bài học: build pass ≠ đúng —
phải đọc output thật.

## Requirements

- Functional: cả 2 app build + typecheck; reader bất biến; tiếng Việt render đúng font mới.
- Non-functional: web export vẫn 9 route, không regression lint.

## Architecture

Không code mới (trừ khi verify lộ bug → quay lại phase 1/2).

## Related Code Files

- Modify: `plan.md` + phase files (đánh dấu completed)
- Modify: `README.md` nếu cần ghi chú font mới (tuỳ)

## Implementation Steps

1. `pnpm typecheck` toàn workspace — sạch.
2. `pnpm test` — 11/11 pass (shared 4 + crawler 7 không liên quan nhưng phải không vỡ).
3. `pnpm --filter mobile lint` (eslint) — 0 lỗi (React Compiler không regress).
4. `pnpm --filter mobile build:web` — export 9 route. Đọc `dist/index.html`:
   - `<!--$!-->` = 0 (không Suspense lỗi)
   - có "Mới cập nhật"/"Đề cử" (chrome render)
   - grep font: `Source Serif` hoặc `Inter` xuất hiện trong CSS bundle
5. Reader bất biến: `git diff --stat` chỉ ra `reader-settings.tsx` + `[chuong].tsx` +
   `Colors.dark`/`ReadingThemes` KHÔNG nằm trong diff.
6. Tiếng Việt: mở web export trong browser, kiểm dấu (ế, ộ, ữ) không vỡ ở Source Serif 4 heading
   + Inter body. Kiểm reader vẫn Literata @1.8.
7. Admin: `pnpm --filter admin build` (hoặc dev) — build sạch, heading serif, CTA sepia.
8. Đánh dấu plan completed.

## Success Criteria

- [ ] `pnpm typecheck` + `pnpm test` + mobile lint sạch
- [ ] web export 9 route, Suspense không lỗi, chrome render đúng
- [ ] `git diff` xác nhận reader + dark + ReadingThemes = 0 thay đổi
- [ ] Dấu tiếng Việt không vỡ trên Source Serif 4 + Inter (kiểm mắt)
- [ ] Admin build sạch, thẩm mỹ Opennote

## Risk Assessment

- Source Serif 4 render dấu tiếng Việt kém hơn kỳ vọng → nếu vỡ, fallback PT Serif hoặc
  giữ Be Vietnam Pro cho heading (đổi 1 dòng FontFamily). Kiểm sớm ở bước 6.
- Font mới làm bundle to hơn / tải chậm → chấp nhận, hoặc giảm weight về mức tối thiểu dùng thật.
