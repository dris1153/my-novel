// Alias tiện dùng, suy ra từ type sinh tự động.
// Để riêng file này vì `pnpm db:types` ghi đè toàn bộ database.types.ts.

import type { Database } from './database.types';

type Tables = Database['public']['Tables'];

export type NovelStatus = Database['public']['Enums']['novel_status'];
export type UserRole = Database['public']['Enums']['user_role'];

export type Novel = Tables['novels']['Row'];
export type Chapter = Tables['chapters']['Row'];
export type Genre = Tables['genres']['Row'];
export type Profile = Tables['profiles']['Row'];
export type ReadingProgress = Tables['reading_progress']['Row'];
