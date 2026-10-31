# Art thủy mặc — nguồn gốc ảnh

Không có seed nên không sinh lại y hệt được; file này ghi đủ để làm lại cùng phong cách.

- Model: OpenAI `gpt-image-2`, quality `high`, ngày 2026-10-31 (key Gemini là free tier nên không dùng được Gemini/Imagen).
- Ảnh mẫu style: `sign-in` (sinh 2 bản, chọn bản 1). 6 ảnh còn lại sinh qua `/v1/images/edits` với ảnh mẫu làm tham chiếu.
- Chuyển mask: `apps/web/scripts/ink-to-mask.mjs` (alpha = độ đậm mực, giấy ≥245 thành trong suốt).

| File | Kích thước sinh | Lệnh chuyển |
|---|---|---|
| `sign-in.webp` | 1024×1536 | `node scripts/ink-to-mask.mjs anchor-1.png public/art/sign-in.webp 840 0.62` |
| `home-banner.webp` | 1536×1024 | `… home-banner-1.png public/art/home-banner.webp 1200` |
| `empty-library.webp`, `no-results.webp`, `no-chapters.webp`, `error.webp` | 1024×1024 | `… <name>-1.png public/art/<name>.webp 320` |
| `not-found.webp` | 1024×1024 | `… not-found-1.png public/art/not-found.webp 320 1 0.18` (mờ mép: bản gốc bị cắt cứng ở rìa trái) |

## Prompt

STYLE (dán nguyên văn vào mọi ảnh):

> Original Chinese ink wash painting (shuimohua) style. Monochrome: pure black ink thinned into soft grey washes, visible brush strokes with dry-brush edges, faint paper grain. Flat pure white background; no colour, no gradient backdrop, no border, no frame. Calm, minimal, premium, contemplative, vast empty negative space. No text, no calligraphy, no seals, no letters, no signature, no human figures or faces. Original composition.

Ảnh dùng tham chiếu mở đầu bằng: *"Use the reference image ONLY as a style reference (brush, ink, paper, negative space). Do not copy its subject or layout."* và thêm *"matching the reference image's brushwork, ink tones, paper and amount of empty space"* vào STYLE.

| Ảnh | Subject | Composition |
|---|---|---|
| sign-in | A lone mountain pavilion on a cliff above a sea of clouds, a thin stone path climbing to its gate, a pale crescent moon in the upper right. | Portrait; subject in the top 55%; bottom 40% empty white paper. |
| home-banner | Layered mountain ridges dissolving into mist, a river winding through the valley, one small empty boat in the lower left. | Wide; subject in the right 60%; left 40% empty for a headline. |
| empty-library | An unrolled blank scroll on a low wooden table, a calligraphy brush resting beside it, one fallen leaf. | Square, small and centered, ≥70% empty. |
| no-results | A small empty boat on wide still water, fog swallowing the horizon. | Square, sparse, centered. |
| no-chapters | A closed bamboo scroll tied with a cord, standing upright. | Square, small and centered, ≥70% empty. |
| not-found | A narrow stone path that ends at the edge of a misty cliff, one bird circling above the void. | Square; path enters lower left, ends mid-frame. |
| error | A paper lantern with a dimmed flame swaying in the wind, a few bamboo stalks bending beside it. | Square, centered, ≥70% empty. |

Muốn sinh lại `not-found` cho đẹp hơn: thêm vào composition *"every element fades softly into the white paper and nothing touches or is cut by the image borders"*.
