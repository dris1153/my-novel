"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { NovelCover } from "./novel-cover";

import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/supabase/config";

type Row = {
  percent: number;
  novels: { slug: string; title: string; cover_url: string | null } | null;
  chapters: { number: number; title: string } | null;
};

/**
 * Đọc ở client để trang chủ giữ ISR. RLS lọc theo `auth.uid()`, nên khách ẩn
 * danh chỉ nhận về rỗng — không cần kiểm tra session ở đây.
 */
export function ContinueReading() {
  const [row, setRow] = useState<Row | null>(null);

  useEffect(() => {
    if (!hasSupabaseConfig) return;
    let active = true;

    createClient()
      .from("reading_progress")
      .select("percent, novels(slug, title, cover_url), chapters(number, title)")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setRow((data as Row | null) ?? null);
      });

    return () => {
      active = false;
    };
  }, []);

  if (!row?.novels || !row.chapters) return null;

  const percent = Math.round(Math.min(1, Math.max(0, row.percent)) * 100);

  return (
    <Link
      href={`/truyen/${row.novels.slug}/chuong-${row.chapters.number}`}
      className="flex items-center gap-4 rounded-lg bg-sepia-soft p-4 transition-[filter] hover:brightness-[0.98]">
      <div className="w-12 shrink-0">
        <NovelCover
          uri={row.novels.cover_url}
          title={row.novels.title}
          seed={row.novels.slug}
          sizes="48px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] tracking-[0.08em] text-sepia-text uppercase">Đang đọc</p>
        <p className="truncate font-serif text-[17px] text-ink">{row.novels.title}</p>
        <p className="truncate text-xs text-ink-2">
          Chương {row.chapters.number} — {row.chapters.title}
        </p>
        <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-sepia" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </Link>
  );
}
