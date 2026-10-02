---
phase: 4
title: "Verify"
status: done
priority: P1
effort: "1h"
dependencies: [1, 2, 3]
---

# Phase 4: Verify

## Kết quả

| Hạng mục | Kết quả |
|---|---|
| `pnpm --filter web typecheck` / `lint` / `build` | ✅ sạch |
| `pnpm --filter crawler typecheck` + `pnpm test` | ✅ 7/7 |
| `pnpm --filter admin typecheck` | ✅ sạch sau khi revert |
| `git diff apps/admin apps/mobile` | ✅ **rỗng** |
| Spawn CLI từ Node | ✅ chạy đúng, bắt được `✖ HTTP 404` ở stderr, exit code 1 |
| Home mới | ✅ render "Thư viện" + form + empty state; panel "Đề cử tuần" đã biến mất |
| `GET /api/crawl` | ✅ `{"jobs":[]}` |
| **Crawl thật** (`Đại Phụng Đả Canh Nhân`) | ✅ 2085 chương lấy được mục lục, 20 chương nội dung, truyện **đã đăng** |
| **Auto-publish** | ✅ log `novel id=… (đã đăng)` |
| **Resume** | ✅ chạy lần 2: `bỏ qua 10 chương đã có` |
| **Fix bug re-crawl (dữ liệu thật)** | ✅ trước `published:true, cover_url:…, view_count:999` → sau **y hệt** |
| Web đọc được truyện vừa crawl | ✅ home có tên truyện; chi tiết 10 link chương; reader 200 + 69 đoạn văn |

## Chưa kiểm được

**Bấm "Lấy về" trên UI** — cần browser (session không có browser). Mọi mảnh của luồng đó đã
verify riêng lẻ: spawn (script replica chạy y hệt code trong `crawl-runner`), regex
`novel id=`, `GET /api/crawl`, và hành động crawl thật qua CLI. Phần chưa chạm tới là
`useActionState` + `requireUser()` + `revalidatePath` phía form.

## Success Criteria

- [x] Build + lint + typecheck sạch (web, crawler, admin)
- [x] `git diff apps/admin` rỗng
- [x] Không tái hiện bug re-crawl — verify trên **dữ liệu thật**
- [x] Crawl thật chạy từ đầu tới cuối, truyện tự đăng, đọc được trên web
