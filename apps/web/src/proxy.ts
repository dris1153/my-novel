import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { hasSupabaseConfig, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

/**
 * Next 16 đổi tên `middleware` thành `proxy`. Ở đây chỉ gia hạn session Supabase;
 * phân quyền thật nằm ở `requireUser()` phía server.
 */
export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });

  // Thiếu env thì không có session để gia hạn — tránh gọi mạng vô ích.
  if (!hasSupabaseConfig) return response;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list) {
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Bắt buộc gọi getUser() để token được refresh và ghi lại vào cookie.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};
