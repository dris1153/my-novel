# AGENTS.md

Novel reader + admin, pnpm-workspaces monorepo. `README.md` covers one-time Supabase/R2 setup
and the crawler; this file is the fast path for agents.

## Layout

- `apps/mobile` — Expo 57 + expo-router, one codebase for iOS / Android / Web (static export).
- `apps/admin` — Next.js 16 App Router + Tailwind v4, content management.
- `packages/shared` — DB types + pure helpers (`slugify`, `splitChapters`, …). Consumed as
  **TypeScript source** (`main: ./src/index.ts`); admin needs `transpilePackages: ["shared"]`.
  Editing it affects both apps and the crawler.
- `packages/crawler` — local CLI that writes to Supabase with `service_role`.
- `supabase/migrations` — schema + RLS. `DESIGN.md` is the visual system; `plans/` and
  `docs/wireframe/` are design history, not current spec.

## Commands

- `pnpm install` — needs Node 22+; pnpm is pinned to 11.5.1.
- `pnpm mobile` / `pnpm admin` — dev servers.
- `pnpm test` — `node --test` in `shared` + `crawler` only (apps have no test script).
- `pnpm typecheck` — all four packages.
- `pnpm crawl <truyenfull-url> [--limit N]` — resume-safe; skips chapters already stored.
- `pnpm db:push` / `pnpm db:types`.
- `pnpm --filter mobile build:web`.
- Single test: `pnpm --filter shared exec node --test --test-name-pattern=<name> src/index.test.ts`.
- No root `lint` script; run per app (`pnpm --filter admin lint`, `pnpm --filter mobile lint`).

## Fresh checkout: typecheck fails until generated stubs exist

`pnpm typecheck` errors on `apps/admin` (`Cannot find name 'LayoutProps'/'PageProps'`) and
`apps/mobile` (`Cannot find module '@/global.css'`) because these gitignored files are produced
only at runtime. Generate them first, then trust the result:

- admin: `pnpm --filter admin exec next typegen` (or `next dev` / `next build`) creates
  `next-env.d.ts` and `.next/types`.
- mobile: start the dev server once (`pnpm mobile`) to create `expo-env.d.ts` and `.expo/types`
  (typed routes are on).

`packages/*` typecheck with no extra step.

## Gotchas

- **Do not remove `node-linker=hoisted` from `.npmrc`** — pnpm's default symlinked
  `node_modules` breaks Metro's resolution of React Native transitive dependencies.
- `packages/shared/src/database.types.ts` is hand-written bootstrap; `pnpm db:types` overwrites
  it from the linked Supabase project.
- Schema changes: add a **new** file via `pnpm dlx supabase migration new <name>`; never edit an
  already-pushed migration. Then `pnpm db:push` and `pnpm db:types`.
- Admin authorization is **not** in `proxy.ts` (Next 16's renamed `middleware`; it only refreshes
  the Supabase session). Every page and server action must call `requireAdmin()` from
  `apps/admin/src/lib/auth.ts`.
- Cover uploads go browser → R2 directly via `POST /api/r2/presign`, so the R2 bucket needs CORS
  allowing `PUT` from the dev origin. Accepted: jpg/png/webp, ≤ 2 MB.
- The crawler reads the **root** `.env` (`SUPABASE_SERVICE_ROLE_KEY`, `R2_*`), not the per-app
  env files. `service_role` bypasses RLS — local-only, never bundle it into mobile/admin.
- Mobile env vars are `EXPO_PUBLIC_*`; when missing, `_layout.tsx` renders `<MissingEnv>` instead
  of crashing. Web export is `output: "static"` and only SSR-renders the nav shell, so reader
  pages are not SEO-complete (see README).

## Nested instructions

- `apps/mobile/AGENTS.md` — Expo 57 breaking changes; read the versioned docs before coding.
- `apps/admin/AGENTS.md` — Next 16 breaking changes; read `node_modules/next/dist/docs/` first.
  `next dev` re-adds this block, so keep it in commits.
- Both directories have `CLAUDE.md` that simply `@AGENTS.md`.

## Conventions

- Code comments and user-facing copy are Vietnamese; RLS/DB error messages are surfaced to users
  as-is.
- RLS in `supabase/migrations/20260812000000_init.sql` is the real access boundary:
  `novels`/`chapters` are admin-write only, and unpublished rows must stay invisible to anon.
