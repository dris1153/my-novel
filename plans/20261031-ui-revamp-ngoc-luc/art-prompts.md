# Art "Ngọc Lục" — nguồn gốc ảnh

Không có seed nên không sinh lại y hệt được; file này ghi đủ để làm lại cùng phong cách.

- Model: Meshy `gpt-image-2-5-sunburst`, ngày 2026-10-31. Tổng 114 credit (2 × 9 text-to-image + 8 × 12 image-to-image).
- Ảnh neo: `banner-1` (mẫu B, user chọn). 8 ảnh sau sinh bằng `meshy_image_to_image` với ảnh neo làm tham chiếu; 5 spot dùng `remove_background: true` (PNG nền trong).
- Chuyển WebP: `apps/web/scripts/art-to-webp.mjs <in.png> <out.webp> <width> [height] [quality]`. PNG gốc không commit.

| File | Task id | Nguồn | Lệnh chuyển |
|---|---|---|---|
| `banner-1.webp` | 01a18ff6-0615-7408-ba76-0ea86d9a52d1 | text-to-image (mẫu B, neo) | `… banner-1.png public/art/banner-1.webp 1200 675 68` |
| `banner-2.webp` | 01a18ff6-04f5-7014-bbfd-68062a9202ab | text-to-image (mẫu A) | `… 1200 675 68` |
| `banner-3.webp` | 01a18ffa-46d0-73e4-b347-3a8fc1be583d | image-to-image | `… 1200 675 60` |
| `banner-4.webp` | 01a18ffa-4ec4-7284-91b6-fd3d5dbfb930 | image-to-image | `… 1200 675 60` |
| `sign-in.webp` | 01a18ffa-54d0-72e3-8932-3b55efe536dc | image-to-image, 3:4 | `… 900 1200 62` |
| `empty-library.webp` | 01a18ffa-5922-756c-a3fe-c2edce0e05ad | image-to-image, nền trong | `… 384 384 78` |
| `no-results.webp` | 01a18ffa-5c6f-712b-9495-c3d8b99de314 | như trên | `… 384 384 78` |
| `no-chapters.webp` | 01a18ffa-601f-70a4-8be0-93e2ff33264f | như trên | `… 384 384 78` |
| `not-found.webp` | 01a18ffa-640c-748f-a822-98aebb486d3e | như trên | `… 384 384 78` |
| `error.webp` | 01a18ffa-67bb-7178-8785-67472a39bb2e | như trên | `… 384 384 78` |

## Prompt

STYLE (cuối mọi prompt cảnh):

> Style: vibrant Chinese donghua xianxia fantasy digital painting, rich saturated jewel tones with emerald and jade highlights, luminous spiritual light, cinematic lighting, detailed environment, distant small figures in flowing robes with faces not visible, original composition. No text, no letters, no logo, no watermark, no UI, no recognizable characters.

Spot dùng STYLE ngắn: *vibrant Chinese donghua fantasy digital painting, rich saturated jewel tones with emerald and jade highlights, soft luminous glow. No text, no letters, no logo, no watermark.* Composition spot: *a single isolated object/vignette, centered, simple silhouette, plain flat background, no scenery, nothing touching the image borders.*

Ảnh có tham chiếu mở đầu: *"Use the reference image ONLY as a style reference (palette, lighting, brushwork, level of detail). Do not copy its subject or layout."*

| Ảnh | Subject | Composition |
|---|---|---|
| banner-1 | A celestial palace floating on clouds under a huge pale moon, emerald aurora ribbons, glowing lanterns drifting upward, long stone bridges between floating islands. | Wide; subject right 60%, calmer and darker left 40% / bottom-left for a title. |
| banner-2 | Floating jade mountain peaks above a sea of clouds at golden dusk, waterfalls, a red-roofed pavilion on the highest peak, white cranes in flight. | như trên |
| banner-3 | An ancient riverside town at night, lanterns reflected in the calm river, small wooden boats, blossoming trees, tiered pagoda roofs. | như trên |
| banner-4 | A mountain temple in a bamboo forest beside a pond of glowing spirit lotuses, fireflies, morning mist and light rays. | như trên |
| sign-in | A scholar seen from behind reading in a cliff-top pavilion above a sea of clouds, giant glowing moon, floating lanterns, emerald aurora. | Portrait; subject top 60%, lower part soft calm clouds. |
| empty-library | A small empty wooden bookshelf with one glowing open book and a small jade lantern. | spot |
| no-results | A curious small white fox beside a little paper boat on a round puddle of starlit water. | spot |
| no-chapters | A closed rolled scroll with a jade clasp on a silk cushion, a white crane sleeping beside it. | spot |
| not-found | A weathered blank stone signpost (no writing) at a fork of a small mountain path, mist and grass at its base. | spot |
| error | A slightly torn paper lantern with a weak flickering flame and a few sparks. | spot |

## Icon lối tắt

Fluent Emoji 3D của Microsoft (github.com/microsoft/fluentui-emoji), giấy phép MIT — Copyright (c) Microsoft Corporation. PNG 256² → WebP 128² (`… 128 128 85`), nằm ở `apps/web/src/assets/shortcuts/`.

| File | Emoji |
|---|---|
| `new.webp` | New button |
| `full.webp` | Trophy |
| `genres.webp` | Books |
| `reading.webp` | Open book |
| `library.webp` | Bookmark |
| `search.webp` | Magnifying glass tilted left |
