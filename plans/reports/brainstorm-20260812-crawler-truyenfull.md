# Brainstorm — Crawl truyện từ truyenfull

Ngày: 2026-08-12 · Trạng thái: đã duyệt thiết kế

## Vấn đề

Admin cần import full 1 truyện từ truyenfull.live bằng URL, ví dụ
`https://truyenfull.live/dai-phung-da-canh-nhan/` → crawl metadata + toàn bộ chương vào Supabase.

## Feasibility (đã xác minh bằng request thật)

- Site **server-rendered** → không cần headless browser, chỉ `fetch` + header UA.
- Cloudflare: 403 nếu thiếu UA; UA trình duyệt → 200 OK. Đơn giản *lúc này*.
- Selector sạch: `h3.title`, `itemprop=author`, `#chapter-c` (nội dung), chương `/chuong-N/`,
  listing phân trang `/trang-N/`, tổng trang ở `#total-page value`.
- Quy mô truyện mẫu: **42 trang × 50 = ~2100 chương**, ~154MB HTML, ~2100 request tuần tự.

## Quyết định kiến trúc

| Câu hỏi | Chốt | Lý do |
|---|---|---|
| Runtime | **CLI cục bộ** `pnpm crawl <url>` | 2100 req/40-70 phút KHÔNG chạy được trong Vercel serverless (timeout 10-60s) |
| Scope | **Import 1 lần** | Truyện Full/hoàn thành; YAGNI, không sync/cron |
| Ghi DB | service_role (bypass RLS) | CLI là môi trường tin cậy, không qua browser |
| `published` | **false** (nháp) | Review trong admin trước khi lên app |
| Dedupe | upsert `(novel_id, number)` | Resume-safe, đúng pattern bulk-import đã có |
| Genre miss | log, bỏ qua | Không tạo genre rác; FK cần genre có sẵn |
| Cover | upload R2 nguyên bản (S3 client) | Ảnh nguồn nhỏ; thêm sharp sau nếu cần |
| Nội dung | `<br>/<p>` → `\n\n` | Reader tách đoạn theo `\n\n` |
| Credit dịch giả | **giữ nguyên** | Tôn trọng nguồn, đơn giản hơn |
| Cờ test | **`--limit N`** | Chạy thử 10 chương trước khi full 2100 |

## Kiến trúc

Workspace mới `packages/crawler`, không đụng mobile/admin. Tái dùng `slugify`, `countWords` từ `shared`.

```
packages/crawler/
├── src/
│   ├── fetch.ts   # fetch + UA, retry backoff, throttle ~1s, phát hiện CF challenge → abort sạch
│   ├── parse.ts   # bóc metadata + link chương + nội dung #chapter-c (thuần, có test)
│   ├── crawl.ts   # orchestrator: listing → 42 trang → chương, log tiến độ, resume
│   └── cli.ts     # entry: đọc URL + env + cờ --limit
└── package.json   # deps: shared, @supabase/supabase-js, @aws-sdk/client-s3, node-html-parser
```

Deps mới: `node-html-parser` (nhẹ), reuse `@supabase/supabase-js` + `@aws-sdk/client-s3`.
Env: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `R2_*` (đọc từ root `.env` hoặc admin).

## Luồng crawl

```
pnpm crawl <url> [--limit N]
1. GET listing → title, author, status, genres, description, cover
2. upsert novel (published=false)
3. map genres: slugify(tên nguồn) → khớp bảng genres; miss → log
4. tải cover → upload R2 nguyên bản
5. GET /trang-1..N/ → gom toàn bộ link chương
6. query chương đã có → BỎ QUA (resume)
7. mỗi chương thiếu: GET → bóc #chapter-c → <br>/<p> thành \n\n → upsert
   delay ~1s, backoff nếu 429/403, --limit cắt sớm để test
8. log "N/total done"; đứt → chạy lại lệnh tiếp từ chỗ dừng
```

## Rủi ro

1. **Cloudflare leo thang JS challenge** → fetch chết. Mitigation: N lỗi liên tiếp → dừng sạch,
   in hướng dẫn resume. Không cố vượt Turnstile (dự án khác).
2. **HTML nguồn đổi layout** → parse hỏng. Mitigation: `parse.ts` tách riêng + test, sửa 1 chỗ.
3. **Chương lỗi lẻ tẻ** (404/rỗng) → log + bỏ qua, 1 chương không làm chết job.
4. **Pháp lý**: crawl + đăng lại truyện dịch có bản quyền — quyết định của user, đã nêu.

## KHÔNG làm (YAGNI)

Sync/cron · queue/worker · UI trong admin · resize ảnh · vượt captcha · đa nguồn.

## Success criteria

- `pnpm crawl <url> --limit 10` → 1 truyện nháp + 10 chương trong Supabase, đọc được trong admin.
- Full run 2100 chương hoàn tất hoặc resume được sau khi đứt.
- `parse.ts` có unit test với HTML fixture (không phụ thuộc mạng).
