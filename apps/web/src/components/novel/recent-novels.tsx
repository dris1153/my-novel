"use client";

import { useState } from "react";

import { NovelGridCard } from "./novel-card";

import { Button } from "@/components/ui/button";
import { fetchRecent, type NovelCard } from "@/lib/queries";

const PAGE_SIZE = 24;

/**
 * Trang đầu render ở server (có trong HTML cho SEO); các trang sau nạp ở client
 * để trang chủ không đọc `searchParams` và mất ISR.
 */
export function RecentNovels({ initial }: { initial: NovelCard[] }) {
  const [items, setItems] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(initial.length < PAGE_SIZE);

  async function loadMore() {
    setBusy(true);
    try {
      const next = await fetchRecent(PAGE_SIZE, items.length);
      setItems((prev) => [...prev, ...next]);
      if (next.length < PAGE_SIZE) setDone(true);
    } catch {
      setDone(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((novel, i) => (
          <NovelGridCard key={novel.id} novel={novel} priority={i < 6} />
        ))}
      </div>

      {!done && (
        <div className="mt-10 flex justify-center">
          <Button variant="ghost" onClick={loadMore} disabled={busy}>
            {busy ? "Đang tải…" : "Tải thêm"}
          </Button>
        </div>
      )}
    </>
  );
}
