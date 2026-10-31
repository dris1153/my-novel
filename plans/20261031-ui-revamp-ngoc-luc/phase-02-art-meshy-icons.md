---
phase: 2
title: "Art Meshy + icon lối tắt"
status: completed
priority: P1
effort: "2h + thời gian user duyệt"
dependencies: []
---

# Phase 2: Art Meshy + icon lối tắt

## Overview
Sinh bộ art donghua màu bằng Meshy `gpt-image-2-5-sunburst` (4 banner, sign-in, 5 spot nền trong), chuyển WebP; tải 6 icon Fluent Emoji 3D. Chưa nối vào UI (phase 4, 6).

## Requirements
- Functional: `public/art/banner-{1..4}.webp` (16:9), `sign-in.webp` (3:4), `{empty-library,no-results,no-chapters,not-found,error}.webp` (1:1, nền trong suốt); `src/assets/shortcuts/{new,full,genres,reading,library,search}.webp`.
- Non-functional: banner 1200×675 ≤120 KB; sign-in 900×1200 ≤120 KB; spot 512² ≤40 KB; icon 128² ≤8 KB. Tổng art ≤ ~900 KB. Meshy ≤170 credit.

## Architecture
- Meshy (đã duyệt ngân sách; vẫn báo số credit trước mỗi lượt gọi):
  1. `meshy_text_to_image` ×2, 16:9 → 2 mẫu banner (18 credit). **Dừng, cho user chọn neo** (bản còn lại vẫn dùng làm banner nếu đạt).
  2. `meshy_image_to_image` với `reference_file_paths` = ảnh neo: 2–3 banner (16:9), sign-in (3:4), 5 spot (1:1, `remove_background: true`) — 12 credit/ảnh.
  3. Timeout/5xx: `meshy_list_tasks` (task_type tương ứng) trước khi tạo lại (có thể đã bị trừ credit). Không đạt → sinh lại tối đa trong trần 170.
- STYLE (nguyên văn mọi prompt): *Vibrant Chinese donghua xianxia fantasy digital painting, rich saturated jewel tones with emerald and jade highlights, luminous spiritual light, cinematic lighting, detailed environment, distant small figures in flowing robes with faces not visible, original composition. No text, no letters, no logo, no watermark, no UI, no recognizable characters.*
- Ảnh dùng tham chiếu mở đầu: *"Use the reference image ONLY as a style reference (palette, lighting, brushwork). Do not copy its subject or layout."*
- Subject/composition:

| Ảnh | Subject | Composition |
|---|---|---|
| banner-1 (mẫu A) | Floating jade mountain peaks above a sea of clouds at golden dusk, waterfalls pouring into mist, a red-roofed pavilion, white cranes in flight | Wide; subject right 60%, calmer left 40%, darker bottom-left for a title |
| banner-2 (mẫu B) | A celestial palace on clouds under a huge pale moon, emerald aurora, floating lanterns | như trên |
| banner-3 | An ancient riverside town at night, glowing lanterns reflected in water, small boats, blossoming trees | như trên |
| banner-4 | A bamboo forest temple beside a pond of glowing spirit lotuses, fireflies, morning mist | như trên |
| sign-in | A scholar seen from behind reading on a cliff-top pavilion over a sea of clouds, giant glowing moon | Portrait; subject top 60%, lower part soft clouds |
| empty-library | An empty wooden bookshelf with one glowing open book and a small jade lantern | Single isolated object, centered, plain background |
| no-results | A small paper boat drifting on a starlit puddle, a curious white fox watching | như trên |
| no-chapters | A closed scroll with a jade clasp resting on a cushion, one sleeping crane beside it | như trên |
| not-found | A weathered stone signpost at a misty fork in a mountain path | như trên |
| error | A paper lantern with a flickering flame and a few sparks, slightly torn | như trên |

- Chuyển đổi: thay `apps/web/scripts/ink-to-mask.mjs` bằng `apps/web/scripts/art-to-webp.mjs` (sharp: resize `fit: cover`, WebP q≈78, giữ alpha) — `node scripts/art-to-webp.mjs <in.png> <out.webp> <width> [height]`. PNG gốc để ở scratchpad, không commit.
- Icon: Fluent Emoji 3D (github.com/microsoft/fluentui-emoji, MIT) — `New button`, `Trophy`, `Books`, `Open book`, `Bookmark`, `Magnifying glass tilted left` (`assets/<Name>/3D/<name>_3d.png`, 256²) → WebP 128² bằng cùng script. Import tĩnh (`import x from "@/assets/shortcuts/new.webp"`) để có width/height + URL `/_next/static` (ngoài gate).
- Ảnh ink-wash cũ trong `public/art/` bị thay cùng tên (`sign-in`, spot) hoặc xoá (`home-banner.webp`) ở phase 6, khi component mới đã nối.

## Related Code Files
- Create: `apps/web/public/art/banner-{1..4}.webp`, `apps/web/src/assets/shortcuts/*.webp`, `apps/web/scripts/art-to-webp.mjs`, `plans/20261031-ui-revamp-ngoc-luc/art-prompts.md` (model, ngày, task id, prompt, lệnh chuyển, credit đã tiêu, giấy phép icon)
- Replace (cùng tên, phase 6 mới commit chung với component): `apps/web/public/art/{sign-in,empty-library,no-results,no-chapters,not-found,error}.webp` — tạm sinh ra file `*-color.webp` trong scratchpad để không làm hỏng mask đang dùng
- Delete: `apps/web/scripts/ink-to-mask.mjs` (phase 6)

## Implementation Steps
1. `meshy_check_balance`; báo user số dư + "2 mẫu = 18 credit".
2. Sinh 2 mẫu → tải PNG về scratchpad → cho user xem → user chọn neo.
3. Sinh phần còn lại theo bảng (báo credit trước từng lô), tải PNG, duyệt: không chữ/logo/mặt rõ, đúng tông, spot nền trong thật, nhận ra ở 160px.
4. Viết `art-to-webp.mjs`; chuyển banner vào `public/art/`; spot + sign-in giữ ở scratchpad tới phase 6.
5. Tải 6 icon, chuyển WebP vào `src/assets/shortcuts/`; ghi giấy phép MIT vào `art-prompts.md`.
6. Ghi `art-prompts.md`; kiểm dung lượng.

## Success Criteria
- [ ] User đã chọn neo; mọi ảnh qua checklist
- [ ] Dung lượng trong ngân sách; spot có alpha
- [ ] Tổng credit ≤170 (ghi trong `art-prompts.md`)

## Risk Assessment
- `remove_background` để lại viền/quầng → nếu xấu: sinh spot trên nền `#ffffff` phẳng và tự cắt nền trong script (luminance ≥ 245 → alpha 0).
- Banner có chữ giả/watermark → sinh lại; tỉ lệ 16:9 bị crop trên mobile → giữ chủ thể giữa-phải.
- Không seed → không tái tạo y hệt; `art-prompts.md` đủ để sinh lại cùng phong cách.
