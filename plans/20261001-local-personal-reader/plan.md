---
title: "App đọc truyện cá nhân — chạy local, 1 người dùng"
status: in-progress
scope: project
created: 2026-10-01
source: hội thoại 2026-10-01
demo: docs/wireframe/opennote.html
blockedBy: []
blocks: []
---

# App đọc truyện cá nhân — chạy local

Chốt lại mục đích thật: **không public**, chạy local, **một người dùng**, để lưu và đọc
lại truyện đã crawl. Bỏ hẳn ý tưởng multi-user / deploy / SEO.

## Quyết định

| Hạng mục | Chốt |
|---|---|
| Người dùng | 1 người, chạy `pnpm web` ở localhost |
| Kho truyện | Chung (chỉ có 1 người → "chung" = "của tôi") |
| Thêm truyện | **Dán URL ngay trong web** — bỏ luồng terminal + `/admin` |
| Publish | Tự động, bỏ bước duyệt nháp |
| `apps/admin` | **Revert về nguyên trạng**, tạm không dùng |
| Deploy / SEO / đăng ký công khai | Không đụng tới, để đó (vô hại ở localhost) |

## Cách web gọi được crawler

Crawler dùng `allowImportingTsExtensions` (import `./crawl.ts`) → **không nhét vào bundle
Next được**. Thay vào đó web **spawn CLI bằng tiến trình con**:

```
apps/web (Next server)                     tiến trình con
  POST action "Thêm truyện"
    → spawn tsx packages/crawler/src/cli.ts <url>
    → đăng ký job vào Map trong bộ nhớ  ──→  CLI tự đọc root .env (service_role)
    → trả về ngay                            → ghi novels/chapters thẳng vào DB
  GET /api/crawl (UI poll 2s)
    → job nào có novel id → đọc DB lấy tên + số chương
```

**Hệ quả quan trọng: web server KHÔNG cần `service_role`.** Quyền ghi DB nằm ở tiến trình
con (đọc root `.env` như cũ). Web chỉ đọc dữ liệu công khai.

Tiến trình con **detached** → đóng browser hay restart server thì crawl vẫn chạy tiếp.
Tiến trình con resume-safe → chạy lại cùng URL sẽ bỏ qua chương đã có.

## Phases

| # | Phase | Trạng thái | Deliverable |
|---|-------|-----------|-------------|
| 1 | [Crawler: bug re-crawl + auto-publish](phase-01-crawler.md) | ✅ done | Crawl lại không đẩy về nháp / mất bìa; tự publish |
| 2 | [Thêm truyện bằng URL trong web](phase-02-add-by-url.md) | ✅ done | Form + spawn CLI + tiến trình hiện live |
| 3 | [Home = thư viện của tôi](phase-03-home.md) | ✅ done | Đang đọc + đang lấy về + tất cả truyện |
| 4 | [Verify](phase-04-verify.md) | ✅ done | Build/lint/typecheck sạch; crawl thật chờ service_role |

## Success criteria

- [x] Dán URL trong web → spawn crawler, không mở terminal, không vào `/admin` *(spawn + crawl verify riêng lẻ; bấm trên UI chưa test được vì không có browser)*
- [x] Truyện vào là **đọc được ngay** (tự publish) — verify trên dữ liệu thật
- [x] Crawl đang chạy thì UI hiện tiến trình, không khoá
- [x] Crawl lại truyện đã có chương mới → **không mất trạng thái, không mất bìa** — verify trên dữ liệu thật
- [x] Home mở ra là thấy thư viện của mình, không còn panel catalog công khai
- [x] `apps/admin` về đúng nguyên trạng (`git diff apps/admin` rỗng)

## Còn lại

- Bấm "Lấy về" trên UI (cần browser).
- Ảnh bìa: cần cấu hình R2. Hiện dùng bìa màu sinh từ slug.
- Thể loại nguồn không có trong seed bị bỏ qua (`di-gioi`, `linh-di`, `xuyen-khong`, `co-dai`) —
  muốn hiện thì thêm vào bảng `genres`.

## Ghi chú

- `apps/admin/.env.local` vẫn giữ (gitignored) — cần lại thì có sẵn.
- Cột `novels.featured` và các trang SEO/sitemap vẫn còn nhưng không đầu tư thêm.
