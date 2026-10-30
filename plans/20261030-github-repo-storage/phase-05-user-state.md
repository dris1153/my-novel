---
phase: 5
title: "State: tủ truyện + tiến độ"
status: completed
priority: P1
effort: "5h"
dependencies: [4]
---

# Phase 5: State — tủ truyện + tiến độ

## Overview
Library và reading progress lưu trong `state/<userId>.json` ở branch `state`. Ghi qua Contents API, throttle mạnh để không spam commit/rate limit.

## Requirements
- Functional: ♡ theo dõi/bỏ theo dõi; "Đọc tiếp chương N"; mở lại đúng vị trí cuộn; trang tủ truyện; "Đang đọc" trên home.
- Non-functional: mỗi user 1 file (không conflict chéo); 409 → đọc lại + merge + thử lại ≤3; ghi thất bại không chặn việc đọc.

## Architecture
```
state-store.ts
  readState(uid)         GET contents/state/<uid>.json?ref=state   (fetch tag `state:<uid>`, revalidate 3600)
  mutateState(uid, fn)   GET (no-store, lấy sha) → fn(state) → PUT {content, sha, branch:'state', message:'state: <uid8>'}
                         thành công → revalidateTag(`state:<uid>`); 409 → retry
Server actions:  toggleLibrary(slug)
Route handler:   POST /api/progress {slug, chapter, scroll}  (sendBeacon/keepalive chạy được lúc pagehide; server action thì không)
Client (reader-shell): gửi khi đổi chương + khi pagehide/visibilitychange=hidden; tối thiểu 30s/lần cùng chương
```
- Merge theo `updatedAt` từng truyện khi retry (không đè cả file).
- Commit author = chủ PAT; message ngắn. Lịch sử `state` bẩn là chấp nhận được (branch riêng, không deploy).

## Related Code Files
- Create: `apps/web/src/lib/state-store.ts` (+ `state-merge.ts` + test), `apps/web/src/app/api/progress/route.ts`
- Modify: `apps/web/src/lib/actions.ts` (toggleLibrary), `components/novel/novel-actions.tsx`, `continue-reading.tsx`, `components/reader/reader-shell.tsx`, `lib/reader.ts`, `app/(site)/tu-truyen/page.tsx`, trang chủ "Đang đọc"
- Delete: logic Supabase `library`/`reading_progress` trong các file trên

## Implementation Steps
1. `state-store` + hàm thuần `applyProgress(state, patch)` / `toggle(state, slug)` / `mergeStates(a, b)`; test các hàm thuần (merge theo updatedAt, toggle hai lần = ban đầu).
2. File chưa tồn tại (user mới) → state rỗng; PUT không kèm `sha` để tạo.
3. Route `/api/progress`: `requireUser()`, validate `slug` + số; 204 khi ok.
4. Reader: bỏ interval 5 giây; thêm throttle 30s + sự kiện đổi chương + `pagehide` dùng `navigator.sendBeacon`.
5. Kiểm tra: đọc 20 chương liên tục → số commit trên branch `state` ≈ số chương, không phải số giây.

## Success Criteria
- [ ] Đăng nhập máy B thấy đúng "Đọc tiếp" như máy A
- [ ] Hai tab cùng user ghi gần nhau: không mất ♡ (retry/merge hoạt động)
- [ ] Đóng tab giữa chương → mở lại đúng vị trí (±vài %)
- [ ] Test state-merge xanh

## Risk Assessment
- Secondary rate limit (~80 write/phút): throttle + backoff `retry-after`.
- Token ghi nằm trên Vercel: PAT chỉ 1 repo; nếu lộ chỉ ảnh hưởng `novel-data` (private).
- Độ trễ ghi 0,3–0,8s: chạy nền, UI lạc quan (optimistic) cho ♡.
- Nếu thấy phiền thật: thay `state-store` bằng Upstash Redis — API 2 hàm giữ nguyên nên đổi 1 file.
