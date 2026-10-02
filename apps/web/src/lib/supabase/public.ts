import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "shared";

import { supabaseAnonKey, supabaseUrl } from "./config";

/**
 * Client chỉ đọc dữ liệu công khai: KHÔNG đọc cookie, KHÔNG giữ session.
 *
 * Đây là mấu chốt để giữ ISR — chỉ cần `cookies()` xuất hiện trong cây render
 * là Next đánh dấu route dynamic và mất cache. Trang public dùng client này;
 * trang cần đăng nhập dùng `./server`.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
