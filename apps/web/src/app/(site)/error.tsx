"use client"; // Error boundary phải là client component.

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Illustration } from "@/components/ui/illustration";

export default function SiteError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-[560px] px-4 pt-6">
      <div className="flex flex-col items-center rounded-card bg-surface px-6 py-10 text-center">
        <Illustration name="error" />
        <h1 className="mt-4 font-heading text-xl font-bold text-fg">Có gì đó trục trặc</h1>
        <p className="mt-2 max-w-[40ch] text-sm text-fg-2">
          Không tải được dữ liệu truyện lúc này (thường do kho truyện trên GitHub phản hồi chậm). Thử lại sau giây lát.
        </p>
        <Button onClick={() => retry()} className="mt-6">
          Thử lại
        </Button>
      </div>
    </main>
  );
}
