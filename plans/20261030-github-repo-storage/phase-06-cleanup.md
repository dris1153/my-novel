---
phase: 6
title: "Dọn dẹp"
status: completed
priority: P2
effort: "3h"
dependencies: [2, 3, 4, 5]
---

# Phase 6: Dọn dẹp

## Overview
Xoá mọi dấu vết Supabase/R2/admin/SEO/crawl-từ-web. DB cũ trống nên không cần giữ lại gì; làm sau khi phase 2–5 chạy ổn.

## Requirements
- Functional: không còn import/env/dependency Supabase, R2, AWS SDK trong web/crawler/shared.
- Non-functional: `pnpm install` sạch, lockfile cập nhật, mobile không làm hỏng typecheck/test.

## Related Code Files
- Delete: `apps/admin/`, `supabase/`, `apps/web/src/lib/supabase/`, `lib/crawl-runner.ts`, `lib/crawl-status.ts`, `app/api/crawl/`, `components/novel/{add-novel-form,crawl-progress,view-counter}.tsx`, `components/seo/`, `lib/seo.ts`, `opengraph-image.tsx`, `sitemap.ts`, `app/(site)/dang-ky/`, auth/profile form cũ
- Modify: `apps/web/package.json` (bỏ `@supabase/*`), `packages/shared/src/{index,database.types,models}.ts` (bỏ type DB), root `package.json` (bỏ `admin`, `db:*`, sửa `typecheck`), `pnpm-workspace.yaml` (loại `apps/mobile`), `.env.example` (mới: GITHUB_*, AUTH_*, ALLOWED_EMAILS, DATA_REPO_DIR), `.gitignore`
- Modify docs: `README.md`, `AGENTS.md` (layout, commands, gotchas Supabase/R2/admin → bỏ; thêm data repo + state branch), `docs/huong-dan-su-dung.md` (login Google, crawl bằng CLI)
- Freeze: `apps/mobile/` (giữ thư mục, ghi README 1 dòng "không còn được duy trì")

## Implementation Steps
1. `grep -ri "supabase\|r2\|presign\|service_role" --exclude-dir=node_modules --exclude-dir=plans` → xử lý từng chỗ còn sót.
2. Xoá theo danh sách; `pnpm install` cập nhật lockfile.
3. Sửa `typecheck`/`test` ở root cho khớp workspace mới.
4. Cập nhật AGENTS.md/README/docs; ghi vào changelog nếu có `docs/project-changelog.md`.
5. Chạy lint/typecheck/test/build.

## Success Criteria
- [x] grep không còn kết quả Supabase/R2 ngoài `plans/` và thư mục `apps/mobile` đóng băng
- [x] `pnpm typecheck`, `pnpm test`, `pnpm --filter web lint`, `pnpm --filter web build` xanh
- [x] Docs mô tả đúng kiến trúc mới

## Risk Assessment
- Xoá `supabase/` không đảo ngược nhưng DB trống, chỉ còn schema trong git history. Genres seed đã chuyển sang `index.json` ở phase 1.
- Mobile import `shared/database.types` → loại khỏi workspace trước khi xoá type.
