"use client";

import { useEffect } from "react";

import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/supabase/config";

/**
 * Đếm lượt đọc một lần cho mỗi truyện trong mỗi phiên tab.
 *
 * RPC `increment_view` là SECURITY DEFINER và gọi được bằng anon (client không có
 * quyền UPDATE trên `novels`). Ghi ở client để trang chi tiết giữ ISR.
 */
export function ViewCounter({ novelId }: { novelId: string }) {
  useEffect(() => {
    if (!hasSupabaseConfig) return;

    const key = `viewed:${novelId}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      // Chặn storage thì vẫn đếm, chỉ là có thể đếm lặp khi back/forward.
    }

    createClient()
      .rpc("increment_view", { p_novel_id: novelId })
      .then(() => {});
  }, [novelId]);

  return null;
}
