// Chuyển tranh thủy mặc (mực đen trên nền trắng) thành mask WebP: alpha = độ đậm của mực, RGB đen.
// Trang tô màu bằng CSS (`background-color` + `mask-image`) nên một file dùng được cho cả dark/light.
//
// Usage: node scripts/ink-to-mask.mjs <input.png> <output.webp> <width> [cropTopRatio] [fadeRatio]
//   cropTopRatio: giữ phần trên của ảnh (vd 0.62 bỏ khoảng giấy trắng thừa phía dưới); 1 = giữ nguyên.
//   fadeRatio: làm mờ dần mực sát 4 mép (vd 0.15) khi tranh bị cắt cứng ở rìa.
import sharp from "sharp";

const [input, output, widthArg, cropArg = "1", fadeArg = "0"] = process.argv.slice(2);
if (!input || !output || !widthArg) {
  console.error("Usage: node scripts/ink-to-mask.mjs <input.png> <output.webp> <width> [cropTopRatio] [fadeRatio]");
  process.exit(1);
}

// Giấy sáng hơn ngưỡng này coi là trong suốt hẳn, để không còn lớp nền xám mờ.
const PAPER = 245;

let image = sharp(input).grayscale();
const { width, height } = await image.metadata();
const crop = Number(cropArg);
if (crop < 1) image = image.extract({ left: 0, top: 0, width, height: Math.round(height * crop) });

const { data, info } = await image.resize({ width: Number(widthArg) }).raw().toBuffer({ resolveWithObject: true });
const fade = Number(fadeArg);
// Hệ số 0→1 theo khoảng cách tới mép gần nhất; 1 khi đã cách mép quá `fade` kích thước ảnh.
const edge = (pos, size) => (fade > 0 ? Math.min(1, Math.min(pos, size - 1 - pos) / (fade * size)) : 1);

const rgba = Buffer.alloc(info.width * info.height * 4);
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = y * info.width + x;
    const ink = Math.max(0, Math.min(255, ((PAPER - data[i]) * 255) / PAPER));
    rgba[i * 4 + 3] = Math.round(ink * edge(x, info.width) * edge(y, info.height));
  }
}

const out = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
  .webp({ quality: 80, alphaQuality: 70, effort: 6 })
  .toFile(output);
console.log(`${output}: ${info.width}x${info.height}, ${(out.size / 1024).toFixed(1)} KB`);
