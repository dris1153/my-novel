import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "shared";

import { supabaseAnonKey, supabaseUrl } from "./config";

/**
 * Client cho Client Component. Session nằm trong cookie do `@supabase/ssr` quản,
 * nên server đọc được cùng session đó.
 */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
