// Tách nền phẳng của ảnh mascot và cắt bỏ khoảng trống quanh nhân vật. Ảnh gốc phải sinh trên nền xanh
// chroma (nhân vật không có màu đó), vì `remove_background` của Meshy khoét luôn cả lông trắng.
//
// Usage: node scripts/art-cut-background.mjs <input.png> <output.png>
import sharp from "sharp";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage: node scripts/art-cut-background.mjs <input.png> <output.png>");
  process.exit(1);
}

// Khoảng cách màu so với nền: dưới SOLID là nền hẳn; từ SOLID tới EDGE là viền pha màu nền.
const SOLID = 70;
const EDGE = 150;

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const key = [data[0], data[1], data[2]];

for (let i = 0; i < data.length; i += 4) {
  const distance = Math.hypot(data[i] - key[0], data[i + 1] - key[1], data[i + 2] - key[2]);
  if (distance < EDGE) {
    data[i + 3] = Math.round(255 * Math.max(0, (distance - SOLID) / (EDGE - SOLID)));
    // Khử ánh xanh còn dính ở viền.
    data[i + 1] = Math.min(data[i + 1], Math.round((data[i] + data[i + 2]) / 2));
  }
}

const out = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
  .trim()
  .png()
  .toBuffer({ resolveWithObject: true });
await sharp(out.data).toFile(output);
console.log(`${output}: ${out.info.width}x${out.info.height}`);
