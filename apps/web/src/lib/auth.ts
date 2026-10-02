import { redirect } from "next/navigation";

import { createClient } from "./supabase/server";

/**
 * Trang/Server Action cần đăng nhập. Luôn gọi ở phía server — không dựa vào proxy.
 */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/dang-nhap");

  return { supabase, user };
}
