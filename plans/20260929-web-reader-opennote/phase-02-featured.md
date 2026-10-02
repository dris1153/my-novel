---
phase: 2
title: "Migration featured + toggle admin"
status: done
priority: P0
effort: "1h"
dependencies: [1]
---

# Phase 2: Migration `featured` + toggle admin

## Overview

"Đề cử tuần" cần nguồn dữ liệu. Thêm cột `featured` và cho admin gắn cờ. Fallback ở web
là top `view_count` nếu chưa gắn cờ nào.

## Related Code Files

- Create: `supabase/migrations/<mới>_novel_featured.sql`
- Modify: `apps/admin/src/components/novel-form.tsx` (checkbox "Đề cử")
- Modify: `apps/admin/src/app/(dashboard)/novels/new/page.tsx` nếu cần truyền prop
- Modify: `packages/shared/src/database.types.ts` (qua `pnpm db:types`)

## Steps

1. `pnpm dlx supabase migration new novel_featured`.
2. SQL: `alter table novels add column featured boolean not null default false;`
   + `create index novels_featured_idx on novels (updated_at desc) where published and featured;`
3. `pnpm db:push` → `pnpm db:types`.
4. Thêm checkbox `featured` vào `novel-form.tsx`, wire vào server action `actions.ts`.

## Success Criteria

- [x] Cột `featured` có trong `database.types.ts`
- [x] Admin lưu được cờ đề cử
- [x] Không phá `pnpm --filter admin typecheck`
