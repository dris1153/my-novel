"use client"; // Error boundary phải là client component.

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { InkScene } from "@/components/ui/ink-scene";

export default function SiteError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-[560px] flex-col items-center px-6 py-14 text-center">
      <InkScene className="h-24 w-44" />
      <h1 className="mt-6 font-serif text-xl font-semibold text-fg">Có gì đó trục trặc</h1>
      <p className="mt-2 max-w-[40ch] text-sm text-fg-2">
        Không tải được dữ liệu truyện lúc này (thường do kho truyện trên GitHub phản hồi chậm). Thử lại sau giây lát.
      </p>
      <Button variant="ghost" onClick={() => retry()} className="mt-6">
        Thử lại
      </Button>
    </main>
  );
}
