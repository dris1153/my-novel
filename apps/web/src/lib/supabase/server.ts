import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "shared";

import { supabaseAnonKey, supabaseUrl } from "./config";

/**
 * Client đọc được session từ cookie → dùng cho trang/Server Action cần đăng nhập.
 * Chỉ import ở phía server; trang nào dùng nó sẽ thành dynamic (mất ISR) — đó là
 * lý do trang public phải dùng `./public` thay vì file này.
 */
export async function createClient() {
  const store = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Server Component không set được cookie; việc gia hạn đã do proxy.ts lo.
        }
      },
    },
  });
}
