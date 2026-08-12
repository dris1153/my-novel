"use client";

import Image from "next/image";
import { useState } from "react";

type Props = { slug: string; initialUrl?: string | null };

/**
 * Xin URL ký sẵn rồi PUT thẳng lên R2 — file không đi qua Next server, nên
 * không đụng giới hạn body size của route handler.
 */
export function CoverUpload({ slug, initialUrl }: Props) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/r2/presign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slug: slug || "cover",
          contentType: file.type,
          size: file.size,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Không xin được URL upload");

      const put = await fetch(data.uploadUrl, {
        method: "PUT",
        headers: { "content-type": file.type },
        body: file,
      });
      if (!put.ok) throw new Error(`R2 từ chối upload (HTTP ${put.status})`);

      setUrl(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload thất bại");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-ink-2">
        Ảnh bìa → Cloudflare R2
      </label>

      <div className="rounded-xl border border-dashed border-line bg-raised p-4 text-center">
        {url ? (
          <Image
            src={url}
            alt="Ảnh bìa"
            width={112}
            height={168}
            unoptimized
            className="mx-auto mb-3 rounded-lg object-cover"
          />
        ) : (
          <div className="mx-auto mb-3 flex h-[168px] w-[112px] items-center justify-center rounded-lg bg-line text-xs text-ink-3">
            2:3
          </div>
        )}

        <label className="inline-block rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold">
          {busy ? "Đang tải lên…" : url ? "Đổi ảnh" : "Chọn ảnh"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onPick}
            disabled={busy}
            className="hidden"
          />
        </label>

        <p className="mt-2 text-[11px] text-ink-3">JPG/PNG/WebP · tỉ lệ 2:3 · tối đa 2MB</p>
      </div>

      {error && <p className="mt-2 text-xs text-sienna">{error}</p>}

      <input type="hidden" name="cover_url" value={url} />
    </div>
  );
}
