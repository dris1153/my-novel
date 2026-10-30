# Brainstorm: bỏ Supabase + R2, lưu hết vào repo GitHub

Date: 2026-10-30 | Status: approved, → /ck:plan

## Problem
Bỏ hoàn toàn Supabase (DB + auth) và Cloudflare R2. Truyện, ảnh bìa, state người dùng lưu trong repo GitHub riêng. Deploy Vercel, vài người quen dùng, whitelist, cần định danh để lưu tiến độ đọc.

## Decisions (user-approved)
- Data repo `novel-data`: **private**, tách khỏi repo code.
- Vercel đọc data qua GitHub API ở server (token trong env), `fetch` cache revalidate ~10 phút. Không bundle data vào deploy.
- Auth: Auth.js Google OAuth + `ALLOWED_EMAILS` env. JWT cookie, không DB. userId = hash(email). Gate toàn site bằng `proxy.ts`.
- State: `state/<userId>.json` ở branch orphan `state` của repo data. Ghi bằng Contents API (PUT + sha, retry 409 ≤3).
- Crawler: giữ local, ghi vào clone repo data, commit theo lô ~100 chương, `git push` thẳng main (không PR). Resume = check file tồn tại.
- Scope: chỉ giữ `apps/web` + `packages/crawler` + `packages/shared`. Bỏ `apps/admin`, đóng băng `apps/mobile`. Bỏ SEO, `view_count`, form "Lấy về".

## Layout repo data
```
index.json                  # list novels + genres, crawler sinh (derived)
genres.json
novels/<slug>/meta.json     # title, author, genres, status, featured, cover, updatedAt
novels/<slug>/cover.jpg     # sharp, <=100KB
novels/<slug>/chapters.json # mục lục [{n,title}]
novels/<slug>/chapters/0001.txt
branch state: state/<userId>.json  # {library:[slug], progress:{slug:{chapter,scroll,updatedAt}}}
```
Không list thư mục: Contents API giới hạn 1000 entry/dir.

## Rejected
- Bundle data vào Vercel deploy: vượt giới hạn size, redeploy mỗi crawl/ghi state.
- PR + auto-merge: 1 người 1 repo, không có review, thêm gh auth/conflict/rate limit.
- Repo public: DMCA, token lộ nếu private fetch từ browser.
- Auth magic link / mã mời: loại. Mã mời là phương án dự phòng nếu Google OAuth phiền.

## Risks
| Risk | Mitigation |
|---|---|
| Ghi state chậm + rate limit GitHub (secondary ~80 write/phút) | Chỉ lưu khi đổi chương + `pagehide`, throttle >=30s/lần; mỗi user 1 file |
| Token ghi repo nằm trên Vercel | Fine-grained PAT, chỉ repo data, Contents RW; server-only env |
| Repo phình (>1GB) | ~8MB/truyện dài sau nén; <50 truyện ổn; theo dõi dung lượng |
| Cache stale sau crawl | Revalidate 10 phút; webhook revalidate là phase sau |
| State qua git khó chịu | Fallback: Upstash Redis chỉ cho state, không đụng phần khác |
| Mất data khi migrate | Script export 1 lần từ Supabase+R2; verify đếm chương/ảnh trước khi tắt Supabase |
| Crawl qua GitHub Actions bị Cloudflare chặn | Chưa làm; spike sau khi xong lõi |

## Success criteria
- Web trên Vercel đọc được toàn bộ truyện hiện có từ repo data, không còn env/import Supabase hay R2.
- Email ngoài whitelist bị chặn; email trong whitelist giữ được tủ truyện + chương đang đọc qua nhiều thiết bị.
- `pnpm crawl <url>` resume được, tự push main theo lô, web thấy chương mới trong ~10 phút.
- `pnpm typecheck` + `pnpm test` xanh.

## Next steps
1. Script migrate Supabase+R2 → file (xác minh số lượng).
2. Data layer mới trong `apps/web/src/lib` (GitHub client + cache), thay `queries.ts`/`actions.ts`.
3. Auth.js Google + whitelist + gate.
4. State read/write + debounce client.
5. Crawler: ghi file + git push theo lô, sinh index.
6. Dọn: xoá admin, supabase/, env, README/AGENTS/docs.

## Unresolved
- Tên repo data, và cách chạy migrate (cần Supabase service_role + R2 key hiện có).
- Có giữ `mobile` hay xoá hẳn (hiện: đóng băng).
