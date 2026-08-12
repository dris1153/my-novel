import { S3Client } from "@aws-sdk/client-s3";

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Thiếu biến môi trường ${name} — xem apps/admin/.env.example`);
  return v;
}

/** R2 tương thích S3, region luôn là "auto". */
export function r2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${required("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: required("R2_ACCESS_KEY_ID"),
      secretAccessKey: required("R2_SECRET_ACCESS_KEY"),
    },
  });
}

export const R2_BUCKET = () => required("R2_BUCKET");

export function publicUrl(key: string) {
  return `${required("R2_PUBLIC_URL").replace(/\/$/, "")}/${key}`;
}

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 2 * 1024 * 1024;

/** Validate ở biên tin cậy: client tự khai contentType/size nên phải chặn cả hai. */
export function validateCover(contentType: string, size: number) {
  if (!ALLOWED.has(contentType)) {
    return `Chỉ nhận JPG, PNG hoặc WebP (nhận được ${contentType})`;
  }
  if (!Number.isFinite(size) || size <= 0 || size > MAX_BYTES) {
    return `Ảnh phải nhỏ hơn 2MB`;
  }
  return null;
}
