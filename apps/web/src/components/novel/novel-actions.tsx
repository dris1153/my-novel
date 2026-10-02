"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import { LikeButton } from "@/components/ui/like-button";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/supabase/config";

/**
 * CTA + theo dõi. Cố tình ở client để trang chi tiết giữ ISR: đọc `reading_progress`
 * hay `library` ở server sẽ kéo cookie vào và biến route thành dynamic.
 */
export function NovelActions({
  slug,
  novelId,
  firstNumber,
}: {
  slug: string;
  novelId: string;
  firstNumber: number | null;
}) {
  const router = useRouter();
  const [continueNumber, setContinueNumber] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!hasSupabaseConfig) return;
    const supabase = createClient();
    let active = true;

    supabase
      .from("reading_progress")
      .select("chapters(number)")
      .eq("novel_id", novelId)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        const row = data as { chapters: { number: number } | null } | null;
        setContinueNumber(row?.chapters?.number ?? null);
      });

    supabase
      .from("library")
      .select("novel_id")
      .eq("novel_id", novelId)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setSaved(Boolean(data));
      });

    return () => {
      active = false;
    };
  }, [novelId]);

  async function toggleFollow(next: boolean) {
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      router.push("/dang-nhap");
      return;
    }

    const previous = saved;
    setSaved(next);
    setBusy(true);
    try {
      const { error } = next
        ? await supabase.from("library").insert({ user_id: auth.user.id, novel_id: novelId })
        : await supabase.from("library").delete().eq("novel_id", novelId);
      if (error) setSaved(previous);
    } catch {
      setSaved(previous);
    } finally {
      setBusy(false);
    }
  }

  const target = continueNumber ?? firstNumber;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {target !== null && (
        <ButtonLink href={`/truyen/${slug}/chuong/${target}`}>
          {continueNumber ? `Đọc tiếp chương ${continueNumber}` : "Đọc từ đầu"}
        </ButtonLink>
      )}

      <LikeButton
        liked={saved}
        onToggle={toggleFollow}
        disabled={busy}
        labelOn="Đã theo dõi"
        labelOff="Theo dõi"
      />
    </div>
  );
}
