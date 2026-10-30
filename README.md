# Novel — app đọc truyện

Monorepo pnpm workspaces. Web đọc truyện (Next.js, deploy Vercel) cho vài người quen, một CLI
crawl truyện từ truyenfull. **Không có database**: toàn bộ truyện, ảnh bìa và tiến độ đọc nằm
trong repo GitHub private riêng `novel-data`.

```
apps/web         Next.js 16 — app đọc, gate bằng Google login + whitelist email
packages/shared  type + hàm thuần (slug tiếng Việt, đường dẫn trong repo data)
packages/crawler CLI crawl truyenfull → ghi file vào bản clone repo data → git push
docs/            hướng dẫn sử dụng + wireframe
```

**Hướng dẫn dùng hằng ngày: [`docs/huong-dan-su-dung.md`](docs/huong-dan-su-dung.md)**

## Kiến trúc

```
máy bạn:  pnpm crawl <url> ──ghi file──► clone novel-data ──git push main──┐
                                                                            ▼
Vercel:   apps/web ──GitHub Contents API (token ở server, cache 10 phút)──► repo novel-data (private)
             │                                                               ▲
             └── tiến độ / tủ truyện: ghi file state/<userId>.json ──────────┘ (branch `state`)
```

Repo `novel-data`:

```
index.json                        danh sách truyện + thể loại (crawler sinh, đừng sửa tay)
novels/<slug>/meta.json           tên, tác giả, mô tả, thể loại, featured…
novels/<slug>/cover.jpg           bìa đã nén ≤100KB
novels/<slug>/chapters.json       mục lục [{ n, title }]
novels/<slug>/chapters/00001.txt  nội dung chương
branch state: state/<userId>.json tủ truyện + tiến độ đọc của từng người
```

Định dạng chính xác và hàm dựng đường dẫn: [`packages/shared/src/store.ts`](packages/shared/src/store.ts).

## Chạy lần đầu

Cần Node 22+ và pnpm 11.

**1. Repo data.** Tạo repo GitHub **private** (vd `<you>/novel-data`) với 2 branch:

- `main`: một commit có `index.json` = `{ "updatedAt": null, "genres": [ {"slug","name"}… ], "novels": [] }`
  (danh sách thể loại: tiên hiệp, kiếm hiệp, ngôn tình, đô thị, trinh thám, huyền huyễn,
  khoa huyễn, tâm lý, gia đình, lịch sử — thêm thể loại khác bằng cách sửa `genres` ở đây).
- `state`: branch orphan chỉ có `state/.gitkeep`
  (`git checkout --orphan state && git rm -rf . && mkdir state && touch state/.gitkeep && git add . && git commit -m "init state" && git push -u origin state`).

Clone repo về cạnh repo này (vd `../novel-data`, đang ở `main`).

**2. Token cho web.** GitHub → Settings → Developer settings → Fine-grained tokens: chỉ repo
`novel-data`, quyền **Contents: Read and write**.

**3. Google OAuth.** Google Cloud Console → tạo OAuth client loại *Web*. Redirect URI:
`http://localhost:3000/api/auth/callback/google` (và `<url vercel>/api/auth/callback/google`).

**4. Env.**

```bash
pnpm install
cp .env.example .env                        # crawler: DATA_REPO_DIR
cp apps/web/.env.example apps/web/.env.local # web: GITHUB_DATA_*, AUTH_*, ALLOWED_EMAILS
```

`AUTH_SECRET` sinh bằng `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`.
`ALLOWED_EMAILS` là danh sách email được vào (ngăn cách bằng dấu phẩy); **để trống = không ai vào được**.

**5. Chạy.**

```bash
pnpm crawl https://truyenfull.live/<ten-truyen>/ --limit 10   # thử 10 chương
pnpm web                                                     # http://localhost:3000
```

## Lệnh

| Lệnh | Việc |
|---|---|
| `pnpm web` | dev web |
| `pnpm crawl <url> [--limit N]` | crawl truyện vào repo data, push `main` theo lô 100 chương |
| `pnpm test` | test `shared`, `crawler`, `web` (`node --test`) |
| `pnpm typecheck` | typecheck cả workspace |
| `pnpm --filter web lint` | lint web |
| `pnpm --filter web build` | build production |

> Máy nào `next dev` (Turbopack) báo lỗi `next/font/google` thì chạy `pnpm --filter web exec next dev --webpack`.
> Build production không bị lỗi này.

## Deploy Vercel

- Root Directory `apps/web`, bật "Include source files outside of the Root Directory" (cần `packages/shared`).
- Env Production: `GITHUB_DATA_REPO`, `GITHUB_DATA_TOKEN`, `AUTH_SECRET` (sinh riêng cho prod),
  `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `ALLOWED_EMAILS`.
- Thêm redirect URI của domain Vercel vào OAuth client. Preview deploy cần redirect URI và env riêng.
- Đổi `ALLOWED_EMAILS` → redeploy. Email bị gỡ mất quyền ngay cả khi đang đăng nhập.

## Crawl

CLI chạy trên máy (2000 chương ≈ 35 phút, không chạy được trên serverless). Resume-safe: bỏ qua
chương đã có, chạy lại cùng URL để lấy chương mới. Web thấy dữ liệu mới sau tối đa ~10 phút (cache).

- Cloudflare chặn giữa chừng → dừng sạch, chạy lại lệnh để tiếp tục.
- Thể loại nguồn không có trong `index.json` → log và bỏ qua.
- Credit dịch giả trong nội dung được giữ nguyên.
- Chỉ chạy một lần crawl cho mỗi clone tại một thời điểm.
- Pháp lý: crawl và đăng lại truyện dịch có bản quyền là quyết định của bạn; repo luôn để private.

## Giới hạn đã biết

- Mỗi lần lưu tiến độ là một commit trên branch `state` (đã throttle: ở lại chương ≥5 giây, tối đa 30 giây/lần,
  và khi ẩn tab). GitHub giới hạn ~80 lần ghi/phút cho mỗi token.
- Repo GitHub khuyến nghị dưới ~1GB: một truyện dài khoảng 8MB sau nén, dưới ~50 truyện là ổn.
- Tìm kiếm khớp chuỗi liên tục trên tên truyện/tác giả (không dấu), không full-text.
- Không có lượt đọc, xếp hạng, đề cử tuần.
