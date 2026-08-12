import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "shared";

export async function createClient() {
  const store = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll(list) {
          try {
            list.forEach(({ name, value, options }) => store.set(name, value, options));
          } catch {
            // Server Component không set được cookie. Việc refresh session đã do
            // proxy.ts lo, nên bỏ qua an toàn.
          }
        },
      },
    }
  );
}
