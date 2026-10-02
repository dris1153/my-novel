import { createClient } from "./supabase/server";

/** Dùng cho trang auth: đã đăng nhập thì không cần hiện form nữa. */
export async function getUserOrNull() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
