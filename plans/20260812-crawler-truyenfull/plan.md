---
title: "Crawler truyenfull → Supabase (CLI cục bộ)"
status: completed
scope: project
created: 2026-08-12
source: plans/reports/brainstorm-20260812-crawler-truyenfull.md
blockedBy: []
blocks: []
---

# Crawler truyenfull → Supabase

CLI cục bộ `pnpm crawl <url> [--limit N]` crawl full 1 truyện từ truyenfull.live vào
Supabase (service_role), cover lên R2. Import 1 lần, resume-safe, published=false.

Thiết kế nguồn: [brainstorm report](../reports/brainstorm-20260812-crawler-truyenfull.md) — đã
xác minh feasibility bằng request thật (server-rendered, UA bypass 403→200, ~2100 chương/42 trang).

## Nguyên tắc

YAGNI/KISS/DRY. Tái dùng `slugify`/`countWords` từ `packages/shared`. Không đụng mobile/admin.
Không sync/cron, không queue, không UI admin, không resize, không vượt captcha.

## Phases

| # | Phase | Trạng thái | Deliverable |
|---|-------|-----------|-------------|
| 1 | [Scaffold + Parser (thuần, có test)](phase-01-scaffold-parser.md) | ✅ done | 6/6 test pass offline |
| 2 | [Fetch + Writer + Orchestrator](phase-02-fetch-writer-orchestrator.md) | ✅ done | CLI chạy, fetch+parse verify live; DB write chờ service_role của user |
| 3 | [Verify + docs](phase-03-verify-docs.md) | ⚠ 1 phần | Leak check + workspace green + README done; full E2E cần user chạy với env |

## Build order (vì sao thứ tự này)

1. **Parser trước** — phần rủi ro cao nhất (selector hardcode dễ vỡ khi nguồn đổi) nhưng
   testable hoàn toàn offline với HTML fixture. Chốt xong core rồi mới ghép mạng.
2. **Network + DB sau** — fetch/throttle/CF-detect + Supabase writer + orchestrator resume.
3. **Verify cuối** — `--limit` nhỏ, test resume (ngắt + chạy lại), review truyện nháp.

## Env cần

`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`,
`R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL`. Đọc từ root `.env` (crawler-only,
service_role KHÔNG được lộ ra client — file này chỉ chạy cục bộ).

## Rủi ro chính

- Cloudflare leo thang JS challenge → fetch chết. Mitigation: N lỗi liên tiếp → abort sạch + in resume.
- HTML nguồn đổi layout → parse hỏng. Mitigation: parse.ts tách riêng + test fixture.
- Pháp lý: crawl + đăng lại truyện bản quyền — user đã quyết.

## Success criteria

- [ ] `pnpm crawl <url> --limit 10` → truyện nháp + 10 chương, đọc được trong admin
- [ ] Full run hoàn tất hoặc resume sau khi đứt
- [ ] `parse.ts` có unit test offline (HTML fixture, không phụ thuộc mạng)
- [ ] service_role key không lọt vào bundle mobile/admin
