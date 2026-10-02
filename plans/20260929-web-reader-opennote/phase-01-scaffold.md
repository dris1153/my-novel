---
phase: 1
title: "Scaffold apps/web + cài skill transitions"
status: done
priority: P0
effort: "3h"
dependencies: []
---

# Phase 1: Scaffold `apps/web` + cài skill transitions

## Overview

Tạo app Next.js 16 thứ hai trong monorepo, cấu hình Tailwind v4 + `shared`, env Supabase,
script `pnpm web`. Cài skill `transitions-dev` vào `.opencode/skills/` để dùng ở phase 10.

## Requirements

- Functional: `pnpm web` mở được trang trống; `pnpm --filter web typecheck` sạch.
- Non-functional: theo đúng cấu hình admin (Next 16 breaking changes — đọc
  `node_modules/next/dist/docs/` trước khi code).

## Related Code Files

- Create: `apps/web/package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`,
  `eslint.config.mjs`, `.gitignore`, `.env.example`
- Create: `apps/web/src/app/layout.tsx`, `page.tsx`, `globals.css`
- Create: `.opencode/skills/transitions-dev/` (SKILL.md + `_root.css` + 01..32)
- Modify: root `package.json` (script `web`)

## Steps

1. Copy cấu hình từ `apps/admin` (tsconfig, postcss, eslint, .gitignore) làm chuẩn.
2. `next.config.ts`: `transpilePackages: ["shared"]` + `images.remotePatterns` cho R2.
3. `package.json`: dep `next/react/react-dom/@supabase/ssr/@supabase/supabase-js/shared`.
4. Tải skill transitions về `.opencode/skills/transitions-dev/`.
5. `pnpm install`; chạy `next typegen`; `pnpm --filter web typecheck`.

## Success Criteria

- [x] `pnpm web` chạy dev server
- [x] `typecheck` sạch (sau khi `next typegen`)
- [x] Skill `transitions-dev` xuất hiện trong danh sách skill
