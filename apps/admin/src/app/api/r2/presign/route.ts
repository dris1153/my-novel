import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { slugify } from "shared";

import { requireAdmin } from "@/lib/auth";
import { R2_BUCKET, publicUrl, r2Client, validateCover } from "@/lib/r2";

/**
 * Cấp URL ký sẵn để browser PUT ảnh bìa thẳng lên R2, không đi qua server.
 */
export async function POST(request: Request) {
  await requireAdmin();

  let body: { slug?: string; contentType?: string; size?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body không phải JSON hợp lệ" }, { status: 400 });
  }

  const { slug, contentType, size } = body;
  if (!slug || !contentType || typeof size !== "number") {
    return NextResponse.json({ error: "Thiếu slug, contentType hoặc size" }, { status: 400 });
  }

  const invalid = validateCover(contentType, size);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  const ext = contentType.split("/")[1].replace("jpeg", "jpg");
  // Thêm timestamp để thay bìa không bị CDN trả về bản cache cũ.
  const key = `covers/${slugify(slug)}-${Date.now()}.${ext}`;

  const url = await getSignedUrl(
    r2Client(),
    new PutObjectCommand({
      Bucket: R2_BUCKET(),
      Key: key,
      ContentType: contentType,
      ContentLength: size,
    }),
    { expiresIn: 600 }
  );

  return NextResponse.json({ uploadUrl: url, publicUrl: publicUrl(key) });
}
