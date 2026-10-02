"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addNovelByUrl, type AddNovelState } from "@/lib/actions";

export function AddNovelForm() {
  const [state, formAction, pending] = useActionState(addNovelByUrl, {
    error: null,
  } as AddNovelState);

  return (
    <form action={formAction} className="mt-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          name="url"
          // type="text" chứ không phải "url": normalizeTruyenfullUrl chấp nhận cả
          // link thiếu scheme, mà type="url" sẽ chặn ngay ở browser.
          type="text"
          placeholder="Dán link truyện trên truyenfull…"
          aria-label="URL truyện"
          className="sm:flex-1"
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Đang gửi…" : "Lấy về"}
        </Button>
      </div>

      {state.error && <p className="mt-2 text-sm text-sepia-text">{state.error}</p>}
      {state.message && <p className="mt-2 text-sm text-forest">{state.message}</p>}
    </form>
  );
}
