---
title: "Bỏ Supabase + R2 — lưu truyện/ảnh/state trong repo GitHub, deploy Vercel"
status: in-progress
scope: project
created: 2026-10-30
source: plans/reports/brainstorm-20261030-github-repo-as-storage.md
blockedBy: []
blocks: [20261031-ui-revamp-thu-vien-dem]
supersedes: [20261001-local-personal-reader]
---

# Bỏ Supabase + R2 → repo GitHub `novel-data`

Web (`apps/web`) deploy Vercel, vài người quen dùng (whitelist Google). Mọi data nằm trong
repo **private** `novel-data`. Crawler local push thẳng `main`. State người dùng ở branch `state`.

> `20261001-local-personal-reader` (chạy local, 1 người, spawn crawler từ web) bị thay thế
> bởi plan này. `20260929-web-reader-opennote` đã xong UI, plan này chỉ đổi tầng data/auth.

## Quyết định đã chốt

| Hạng mục | Chốt |
|---|---|
| Data repo | `novel-data`, private, tách khỏi repo code |
| Đọc | GitHub Contents API ở server, token env, `fetch` cache 600s |
| Search/thể loại | `index.json` do crawler sinh, lọc trong memory |
| Ảnh bìa | sharp ≤100KB lúc crawl; route `/api/cover/[slug]` proxy |
| Auth | Auth.js Google + `ALLOWED_EMAILS`, JWT cookie, gate toàn site |
| State | `state/<userId>.json` ở branch `state`, ghi Contents API (sha + retry 409) |
| Ghi tiến độ | khi đổi chương + `pagehide`, ≥30s/lần |
| Crawler | local, commit lô ~100 chương, push main, resume bằng check file |
| Bỏ | `apps/admin`, form "Lấy về", SEO, `view_count`, signup công khai; mobile đóng băng |

## Phases

| # | Phase | Trạng thái | Deliverable |
|---|-------|-----------|-------------|
| 1 | [Format + repo data](phase-01-data-format-and-repo.md) | in-progress (chờ PAT) | Spec file, types shared, repo `novel-data` + branch `state` |
| 2 | [Crawler ghi file + git push](phase-02-crawler-to-files.md) | done | `pnpm crawl` ghi file, sinh index, push theo lô |
| 3 | [Web đọc từ GitHub](phase-03-web-read-layer.md) | done | `queries.ts` mới, cover proxy, mọi trang đọc không Supabase |
| 4 | [Google login + whitelist + gate](phase-04-auth-whitelist.md) | done (chờ Google client ID) | Chỉ email whitelist vào được site |
| 5 | [State: tủ truyện + tiến độ](phase-05-user-state.md) | done | Library/progress ghi vào branch `state` |
| 6 | [Dọn dẹp](phase-06-cleanup.md) | done | Hết Supabase/R2/admin/SEO trong code + docs |
| 7 | [Deploy + verify](phase-07-deploy-verify.md) | in-progress (chờ deploy Vercel) | Chạy trên Vercel, test end-to-end |

Phụ thuộc: 1 → (2, 3) · 3 → 4 → 5 · 6 sau 2–5 · 7 cuối.
Phase 2 và 3 sửa file khác nhau → làm song song được sau phase 1.
Không có bước migrate: DB cũ trống, repo `novel-data` bắt đầu rỗng.

## Success criteria

- [ ] Web trên Vercel đọc được truyện crawl vào repo data; không còn env/import Supabase hay R2
- [ ] Email ngoài whitelist bị chặn (mọi route, kể cả API); email trong whitelist giữ tủ truyện + chương đang đọc qua nhiều thiết bị
- [ ] `pnpm crawl <url>` resume được, push main theo lô, web thấy chương mới ≤ ~10 phút
- [ ] `pnpm typecheck` + `pnpm test` + `pnpm --filter web build` xanh

## Rủi ro chính

| Rủi ro | Giảm thiểu |
|---|---|
| Auth.js v5 chưa chắc khớp Next 16 `proxy.ts` | Spike đầu phase 4; fallback: `jose` + Google OIDC tự viết (~80 dòng) |
| Rate limit ghi GitHub | Throttle client, 1 file/user, retry có backoff |
| Contents API 1000 entry/dir | Không bao giờ list dir; dùng `chapters.json` |
| Repo phình >1GB | Theo dõi; nén bìa; ~8MB/truyện dài |

## Ngoài phạm vi (YAGNI)

Webhook revalidate · crawl qua GitHub Actions · mobile · PR flow · view_count · tìm kiếm full-text.
