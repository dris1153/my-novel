# Art "Mây Tím" — nguồn gốc ảnh

Không có seed nên không sinh lại y hệt được; file này ghi đủ để làm lại cùng phong cách.

- Model: Meshy `gpt-image-2-5-sunburst`, ngày 2026-10-31. Tổng 93 credit (7 ảnh dùng được + 1 lần sinh hỏng): 7 × 12 image-to-image + 1 × 9 text-to-image.
- Tham chiếu: vùng cắt từ `reference-mockup.png` cho hero-1, mascot-cat, boy-cat; sau khi user duyệt, `hero-1` làm tham chiếu cho hero-2/3, mascot-cat cho cat-reading/boy-cat.
- **Không dùng `remove_background` của Meshy cho mascot:** nó khoét lông trắng (mặt mèo thủng, đen trên nền tối; task `01a190b2-d16b-71e1-acaf-a7dde25f5ce6`, đã bỏ, 12 credit). Sinh trên nền xanh `#00D060` rồi tách bằng `apps/web/scripts/art-cut-background.mjs`.
- Chuyển WebP: `apps/web/scripts/art-to-webp.mjs <in.png> <out.webp> <width> [height] [quality]`. PNG gốc không commit.

| File | Task id | Nguồn | Lệnh |
|---|---|---|---|
| `hero-1.webp` | 01a190b2-cb26-73f5-b73d-d25ca37e9c86 | image-to-image, 16:9 | `… 1200 675 72` |
| `hero-2.webp` | 01a190b6-396a-7117-9997-d0782bf2c120 | image-to-image, 16:9 | `… 1200 675 72` |
| `hero-3.webp` | 01a190b6-4071-7555-bb9e-4fa5c5443fda | image-to-image, 16:9 | `… 1200 675 72` |
| `mascot-cat.webp` | 01a190b4-573f-7293-b696-2e83d62587ee | image-to-image, 1:1, nền xanh | cắt nền, `… 400 "" 82` |
| `cat-reading.webp` | 01a190b6-4659-7119-bd7c-4d18529de7f2 | image-to-image, 1:1, nền xanh | cắt nền, `… 400 "" 82` |
| `boy-cat.webp` | 01a190b6-4979-75ac-91c0-e33a37bf5f13 | image-to-image, 1:1, nền xanh | cắt nền, `… 560 "" 82` |
| `logo-book.webp` | 01a190b6-4c57-7684-bfb5-150fbfa2ae28 | text-to-image, 1:1, nền xanh | cắt nền, `… 192 "" 90` |

## Prompt

Mỗi tranh có tham chiếu mở đầu: *"Use the reference image ONLY as a style reference (soft pastel anime illustration, palette, lighting, delicate linework). Do not copy its layout."* và kết thúc: *"No text, no letters, no logo, no watermark, no UI elements."*

Banner, composition chung: *"Wide; the girl and cat in the right 60% of the frame; the left 40% is a bright, pale, soft and nearly empty area in cream and lavender for a title overlay."*

| Ảnh | Subject |
|---|---|
| hero-1 | A girl with long dark hair and cat ears sleeping with her head on a stack of old books at a wooden desk, hugging a small calico cat that also sleeps, warm sunlight from a window, tall bookshelves and a green potted plant, loose pages. |
| hero-2 | The same girl, awake and smiling, sitting on a fluffy cloud reading an open book, the calico cat beside her, a dreamy library among pink and lavender clouds, books gently flying, soft golden light. |
| hero-3 | The same girl on a small wooden ladder in a cozy bookshop reaching for a book on tall colourful shelves, the calico cat on a stack of books looking up, warm afternoon light, hanging plants. |

Mascot, kết thúc chung: *"Single isolated character, centered, nothing touching the image borders. The entire background is one perfectly flat solid chroma-key green color #00D060 with no gradient, no shadow, no glow and no texture."*

| Ảnh | Subject |
|---|---|
| mascot-cat | A cute round calico cat (white fur with orange and dark brown patches) lying on a small fluffy white-and-peach cloud, eyes happily closed, rosy cheeks, one paw hanging down, a small white speech bubble with a red heart above its head. Solid continuous brown outline. Soft cel shading. |
| cat-reading | Same calico cat, same sticker style, sitting on the cloud holding an open blue book with both paws, reading happily, one small pink heart above. |
| boy-cat | A cute chibi boy with messy dark brown hair lying on his stomach on a cloud, reading an open blue book held in front of him, big gentle eyes over the book; the same calico cat sleeping on top of his head. |
| logo-book | App logo icon: an open book seen from the front, thick rounded dark indigo outline, pages in soft periwinkle and lavender gradient, three small golden sparkles above. Bold, minimal, readable at 40 pixels. |
