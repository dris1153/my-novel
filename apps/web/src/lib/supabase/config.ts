/**
 * Cấu hình Supabase dùng chung cho mọi client.
 *
 * Thiếu env thì app vẫn phải build/prerender được (giống `MissingEnv` của mobile)
 * thay vì nổ ở module scope. Query nào cũng phải kiểm `hasSupabaseConfig` trước.
 */
export const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "missing-anon-key";
