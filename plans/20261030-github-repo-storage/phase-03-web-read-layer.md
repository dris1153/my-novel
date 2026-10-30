---
phase: 3
title: "Web đọc từ GitHub"
status: completed
priority: P1
effort: "6h"
dependencies: [1]
---

# Phase 3: Web đọc từ GitHub

## Overview
Thay `apps/web/src/lib/queries.ts` (Supabase) bằng data layer đọc repo `novel-data` qua GitHub API. Giữ nguyên tên hàm/kiểu trả về tối đa để UI ít phải sửa.

## Requirements
- Functional: home (featured/recent/popular→thay bằng recent), thể loại, tìm kiếm, chi tiết, mục lục phân trang, đọc chương, ảnh bìa.
- Non-functional: token chỉ ở server; mỗi request trang tốn ≤2 call GitHub (phần còn lại từ cache); không list thư mục.

## Architecture
```
Server Component ─► queries.ts ─► github-store.ts ─► api.github.com/repos/{repo}/contents/{path}?ref=main
                                   fetch(..., { next: { revalidate: 600, tags: [path] } })
                                   headers: Authorization: Bearer GITHUB_DATA_TOKEN
                                            Accept: application/vnd.github.raw+json
/api/cover/[slug] (route handler) ─► raw bytes, Cache-Control: public, s-maxage=86400, stale-while-revalidate
```
- `getIndex()` cache 1 lần/request (React `cache`) rồi lọc: search = `includes` không dấu trên title+author; genre/featured/recent = filter+sort.
- Chương: `chapters.json` (slice cho mục lục) + `chapters/NNNNN.txt`.
- Kiểu `NovelCard`, `NovelDetail`, `ChapterListItem`… định nghĩa lại từ `shared/store`; bỏ `id` uuid → dùng `slug` làm khoá; `chapter_id` → số chương.

## Related Code Files
- Create: `apps/web/src/lib/github-store.ts`, `apps/web/src/app/api/cover/[slug]/route.ts`
- Modify: `apps/web/src/lib/queries.ts` (viết lại), mọi component đang nhận `id`/`cover_url`: `novel-card`, `novel-cover`, `novel-hero`, `featured-panel`, `recent-novels`, `chapter-list`, `toc-list`, `genre-list`, các page trong `app/(site)` và `app/(reader)`
- Modify: `apps/web/next.config.ts` (bỏ wildcard `remotePatterns`; bìa là đường dẫn nội bộ không query)
- Đọc trước: `node_modules/next/dist/docs/` (Next 16 — caching/`fetch` options, route handlers đã đổi)

## Implementation Steps
1. `github-store.ts`: `readText(path, ref='main')`, `readJson<T>(path)`, `readBinary(path)`; 404 → `null`; lỗi 403/429 → throw rõ ràng (log rate limit header).
2. Viết lại `queries.ts` theo từng hàm hiện có; `fetchNovelSummaries(ids)` đổi thành theo slug (dùng cho Đọc tiếp/Tủ truyện).
3. Cover route: validate slug theo regex; trả 404 nếu không có; `Content-Type: image/jpeg`.
4. Sửa component/page cho khớp kiểu mới (chạy `tsc` để dò chỗ vỡ).
5. Thời điểm này `reading_progress`/`library` vẫn chưa có → tạm trả rỗng (phase 5 làm); `ViewCounter` bỏ ở phase 6.

## Success Criteria
- [x] `pnpm --filter web typecheck` + `lint` + `build` xanh
- [x] Home, thể loại, tìm kiếm, chi tiết, mục lục, đọc chương, bìa chạy đúng với data thật trên GitHub (dev server + curl)
- [x] Không có request tới Supabase/R2 từ trang đọc; token chỉ ở server; 10 lượt hit liên tiếp không tốn thêm rate limit (cache hoạt động)

## Risk Assessment
- Rate limit 5000 req/h: cache 600s + `index.json` dùng chung → dư sức cho vài người.
- Limit cache item 2MB: chương/index/chapters.json đều nhỏ hơn nhiều; bìa ≤100KB.
- Cache trễ ≤10 phút sau crawl — chấp nhận (webhook là phase sau nếu cần).
- Tìm kiếm không dấu: dùng `normalize('NFD')` bỏ dấu + `đ→d`; có hàm `slugify` ở shared, tái dùng nếu hợp.
