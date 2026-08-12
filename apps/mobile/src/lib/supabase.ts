import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import type { Database } from 'shared';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/** _layout.tsx chặn ở đây; không màn hình nào chạy tới client khi cờ này false. */
export const hasSupabaseConfig = Boolean(url && anonKey);

export const missingEnvKeys = [
  url ? null : 'EXPO_PUBLIC_SUPABASE_URL',
  anonKey ? null : 'EXPO_PUBLIC_SUPABASE_ANON_KEY',
].filter((k): k is string => k !== null);

/**
 * `expo export` prerender route bằng Node, ở đó không có `window` — mà
 * AsyncStorage bản web lại đọc window.localStorage ngay khi Supabase khôi phục
 * session. React Native luôn có `window`, nên điều kiện này chỉ loại trừ đúng
 * bước prerender.
 */
const canPersist = typeof window !== 'undefined';

/**
 * Giá trị giả khi thiếu env: createClient tự ném nếu URL rỗng, mà ném ở module
 * scope thì expo-router nạp cây route là app chết ngay, không kịp hiện lỗi gì.
 */
export const supabase = createClient<Database>(
  url || 'http://127.0.0.1:54321',
  anonKey || 'missing-anon-key',
  {
    auth: {
      storage: canPersist ? AsyncStorage : undefined,
      persistSession: canPersist,
      autoRefreshToken: canPersist,
      // Chỉ browser mới có OAuth redirect mang token về trên URL.
      detectSessionInUrl: canPersist && Platform.OS === 'web',
    },
  }
);
