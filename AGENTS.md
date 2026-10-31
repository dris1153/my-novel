# AGENTS.md

Novel reader, pnpm-workspaces monorepo. No database: content and user state live in a separate
private GitHub repo (`novel-data`). `README.md` has the setup and architecture; this file is the
fast path for agents.

## Layout

- `apps/web` — Next.js 16 App Router + Tailwind v4, deployed to Vercel. Reads `novel-data` through
  the GitHub Contents API (server-side, token in env). Whole site is behind Google login + whitelist.
- `packages/shared` — pure helpers (`slugify`, `splitChapters`, …) and `src/store.ts` (the data-repo
  file format + path builders). Consumed as **TypeScript source** (`main: ./src/index.ts`); web needs
  `transpilePackages: ["shared"]`.
- `packages/crawler` — local CLI: truyenfull → files in a clone of `novel-data` → `git push main`.
- `DESIGN.md` is the current visual system ("Thư viện đêm", dark-first); `plans/` and `docs/wireframe/` are design history, not current spec.

## Commands

- `pnpm install` — Node 22+, pnpm pinned to 11.5.1.
- `pnpm web` — dev server. If `next/font/google` fails under Turbopack, use
  `pnpm --filter web exec next dev --webpack` (production build is fine).
- `pnpm test` — `node --test` in `shared`, `crawler`, `web` (`apps/web/src/lib/*.test.ts` only).
- `pnpm typecheck` — all three packages.
- `pnpm crawl <truyenfull-url> [--limit N]` — resume-safe; skips chapters already stored.
- `pnpm --filter web lint`; `pnpm --filter web build`.
- Single test: `pnpm --filter shared exec node --test --test-name-pattern=<name> src/store.test.ts`.

## Fresh checkout: typecheck fails until Next generates route types

`pnpm typecheck` errors on `apps/web` (`Cannot find name 'PageProps'/'LayoutProps'/'RouteContext'`)
because those types are generated. Run `pnpm --filter web exec next typegen` first
(or `next dev` / `next build`).

## Data model

- Repo `novel-data`: `index.json` (derived by the crawler, never hand-edit), `novels/<slug>/{meta.json,
  cover.jpg,chapters.json,chapters/NNNNN.txt}`, and branch `state` with `state/<userId>.json`.
- Never list directories in the Contents API (cut at 1000 entries) — read `chapters.json`.
- Always build repo paths with the helpers in `packages/shared/src/store.ts`; they validate slugs
  (path-traversal guard).
- `userId` = `sha256(lowercased email)[:32]` (`apps/web/src/lib/identity.ts`).

## Gotchas

- **Auth gate.** `apps/web/src/proxy.ts` gates everything except `_next/static` and `favicon.ico`.
  Never exclude paths by file extension in the matcher — a lost backslash once let slugs ending in
  `png` bypass it. `src/lib/gate.test.ts` reads the real matcher from `proxy.ts`. Next requires the
  matcher to be a literal, so don't move it into an imported constant.
- Defence in depth: every content read goes through `getAuthorizedUser()` (`lib/auth.ts`) inside
  `lib/github-store.ts`; pages/actions call `requireUser()`. `session.user.id` can be `""` — test truthiness.
- `ALLOWED_EMAILS` is fail-closed (empty/missing = nobody gets in) and re-checked on every request.
- **State writes are git commits** (`lib/state-store.ts`): they retry on 409/422 re-applying a pure
  `apply` fn; `setProgress`/`setSaved` return the same object when nothing changed so no commit is made.
  The client throttles (`components/reader/use-progress-sync.ts`) and deliberately does not save on unmount.
- Reads are cached via `fetch` tags (600s); writes call `revalidateTag(tag, { expire: 0 })`. Don't set
  `dynamic = "force-dynamic"` on content pages — it disables that cache and burns the GitHub rate limit.
  Pages that must not prerender at build call `await connection()` instead.
- The crawler imports values from `shared/src/store.ts` (not `shared`): `node --test` can't resolve
  the extensionless re-exports in `shared/src/index.ts`.
- The crawler reads the **root** `.env` (`DATA_REPO_DIR`), not `apps/web/.env.local`. `DATA_REPO_DIR`
  must be the git root of the clone and on `main`.
- Covers are served by `/api/cover/[slug]` (repo is private) and rendered with `unoptimized`.
- Colours: use the token utilities (`bg-canvas`, `bg-surface`, `text-fg`, `text-fg-2`, `text-accent-fg`, `bg-accent`…), never raw hex in app chrome. `contrast.test.ts` parses `globals.css`; `reader-themes.test.ts` checks the reader palette. Amber as *text* must use `accent-fg` (dark amber in light theme).
- Chapter titles from the source repeat "<novel> - Chương N:"; `lib/chapter-title.ts` strips that at read time — UI prints "Chương N" itself.
- `.npmrc` keeps `node-linker=hoisted`; it is no longer required but changing it reinstalls everything.
- `next dev` generates `apps/web/AGENTS.md` / `CLAUDE.md` (Next 16 breaking-changes notice); keep them in commits.

## Nested instructions

- `apps/web/AGENTS.md` — Next 16 breaking changes; read `node_modules/next/dist/docs/` before writing Next code.

## Conventions

- Code comments and user-facing copy are Vietnamese.
- Web env: `GITHUB_DATA_REPO`, `GITHUB_DATA_TOKEN`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`,
  `ALLOWED_EMAILS` (see `apps/web/.env.example`); server-only, never `NEXT_PUBLIC_*`.
