"use client";

import { useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/supabase/config";

/**
 * Trạng thái đăng nhập cho header. Cố tình đọc ở client: nếu server đọc cookie
 * thì MỌI trang public mất ISR (Next coi route là dynamic).
 */
export function HeaderAuthSlot() {
  const [ready, setReady] = useState(!hasSupabaseConfig);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!hasSupabaseConfig) return;
    const supabase = createClient();
    let active = true;

    // getSession đọc cookie/localStorage, không gọi mạng.
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setEmail(data.session?.user.email ?? null);
      setReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setEmail(session?.user.email ?? null);
      setReady(true);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  // Placeholder cùng chiều cao để không đẩy layout khi session về.
  if (!ready) return <span aria-hidden className="inline-block h-9 w-[92px]" />;

  if (!email) return <ButtonLink variant="ghost" href="/dang-nhap">Đăng nhập</ButtonLink>;

  return (
    <ButtonLink variant="ghost" href="/toi" className="max-w-[160px]">
      <span className="truncate">{email.split("@")[0]}</span>
    </ButtonLink>
  );
}
