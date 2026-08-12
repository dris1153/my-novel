import { redirect } from "next/navigation";

import { createClient } from "./supabase/server";

/**
 * Server Action gọi được trực tiếp bằng POST, không chỉ qua UI — nên MỌI action
 * và page phải tự gọi hàm này, không dựa vào proxy.ts.
 */
export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, display_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/login?error=forbidden");

  return { supabase, user, profile };
}
