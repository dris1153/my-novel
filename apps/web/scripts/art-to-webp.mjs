// Chuyển ảnh art (PNG từ Meshy, icon Fluent Emoji) thành WebP đúng kích thước dùng trên trang, giữ alpha.
//
// Usage: node scripts/art-to-webp.mjs <input.png> <output.webp> <width> [height] [quality]
//   Có height thì cắt vừa khung (fit: cover, lấy giữa); không có thì giữ tỉ lệ gốc.
import sharp from "sharp";

const [input, output, widthArg, heightArg, qualityArg = "78"] = process.argv.slice(2);
if (!input || !output || !widthArg) {
  console.error("Usage: node scripts/art-to-webp.mjs <input.png> <output.webp> <width> [height] [quality]");
  process.exit(1);
}

const out = await sharp(input)
  .resize({ width: Number(widthArg), height: heightArg ? Number(heightArg) : undefined, fit: "cover" })
  .webp({ quality: Number(qualityArg), alphaQuality: 80, effort: 6 })
  .toFile(output);
console.log(`${output}: ${out.width}x${out.height}, ${(out.size / 1024).toFixed(1)} KB`);
