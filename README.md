# Novel — app đọc truyện

Monorepo pnpm workspaces. Một codebase React Native chạy iOS/Android/Web, một admin Next.js
để đăng truyện, Supabase làm database + auth, Cloudflare R2 lưu ảnh bìa.

```
apps/mobile      Expo 57 + expo-router  → iOS, Android, Web (static render)
apps/web         Next.js 16             → app đọc truyện cá nhân (chạy local)
apps/admin       Next.js 16             → trang quản trị
packages/shared  types DB + helper thuần (slug tiếng Việt, tách chương)
packages/crawler CLI crawl truyện từ truyenfull → Supabase
supabase/        migration
docs/            hướng dẫn sử dụng + wireframe
```

**Hướng dẫn dùng app đọc hằng ngày: [`docs/huong-dan-su-dung.md`](docs/huong-dan-su-dung.md)**

## Chạy lần đầu

Cần Node 22+. Dùng Supabase hosted nên **không cần Docker**.

**1. Tạo project** tại [supabase.com/dashboard](https://supabase.com/dashboard) → New project.
Ghi lại database password, và lấy project ref trong URL dashboard
(`.../project/<ref>` — chuỗi ~20 ký tự).

**2. Đẩy schema lên:**

```bash
pnpm install
pnpm dlx supabase login
pnpm db:link --project-ref <ref>   # hỏi database password
pnpm db:push                       # chạy migration
```

**3. Điền env.** Lấy URL + anon key ở Dashboard → Project Settings → API Keys:

```bash
cp apps/mobile/.env.example apps/mobile/.env
cp apps/admin/.env.example  apps/admin/.env.local
cp apps/web/.env.example    apps/web/.env.local
```

**4. Chạy:**

```bash
pnpm mobile        # Expo — bấm w để mở web, i/a cho iOS/Android
pnpm web           # http://localhost:3000 — web đọc truyện
pnpm admin         # http://localhost:3001 (nếu web đang chiếm 3000)
```

## Tạo tài khoản admin

Dashboard → Authentication → Add user → tạo email/password. Rồi vào SQL Editor nâng quyền:

```sql
update profiles set role = 'admin' where id = '<user-id>';
```

Mọi user mới mặc định là `reader`. RLS chỉ cho `admin` ghi vào `novels`/`chapters`.

## Cloudflare R2

1. Tạo bucket (mặc định `novel-covers`).
2. R2 → Manage API Tokens → tạo token quyền **Object Read & Write**.
3. Điền `R2_*` vào `apps/admin/.env.local`.
4. Bật public access cho bucket hoặc map custom domain, rồi đặt vào `R2_PUBLIC_URL`.
5. Thêm CORS cho bucket, nếu không browser sẽ không PUT được:

```json
[{ "AllowedOrigins": ["http://localhost:3000"], "AllowedMethods": ["PUT"], "AllowedHeaders": ["content-type"] }]
```

## Đổi schema

Sửa SQL bằng cách **thêm file migration mới**, không sửa file cũ đã push:

```bash
pnpm dlx supabase migration new ten_thay_doi   # tạo file rỗng trong supabase/migrations/
# viết SQL vào đó
pnpm db:push
pnpm db:types                                  # đồng bộ lại type
```

`database.types.ts` hiện đang viết tay để bootstrap — lần chạy `db:types` đầu tiên sẽ ghi đè
nó bằng bản sinh tự động từ DB thật.

Admin xin URL ký sẵn từ `/api/r2/presign` rồi upload thẳng từ browser lên R2 — file không
đi qua Next server.

## Lệnh

| Lệnh | Việc |
|---|---|
| `pnpm mobile` / `pnpm mobile:web` | dev app |
| `pnpm web` | dev web đọc truyện (`apps/web`) |
| `pnpm admin` | dev admin |
| `pnpm db:push` | đẩy migration mới lên project đã link |
| `pnpm db:types` | sinh lại `packages/shared/src/database.types.ts` từ DB |
| `pnpm typecheck` | typecheck cả workspace |
| `pnpm test` | test helper |
| `pnpm crawl <url> [--limit N]` | crawl truyện từ truyenfull vào Supabase |
| `pnpm --filter mobile build:web` | export web tĩnh ra `apps/mobile/dist` |

> `.npmrc` đặt `node-linker=hoisted`. **Đừng bỏ dòng này** — node_modules symlink mặc định
> của pnpm làm Metro không resolve được transitive dependency của React Native. Vẫn giữ được
> store chung nên không mất lợi thế dung lượng của pnpm.

## Crawl truyện từ truyenfull

CLI cục bộ import full 1 truyện từ truyenfull.live vào Supabase (ghi bằng `service_role`,
bìa lên R2). Chạy trên máy — KHÔNG deploy, KHÔNG chạy trong admin (2100 chương/40-70 phút
vượt xa timeout serverless).

**1. Env.** Crawler đọc root `.env` (khác với env per-app):

```bash
cp .env.example .env
# điền SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (Dashboard → Settings → API Keys → service_role),
# và R2_* (dùng lại bucket ảnh bìa của admin)
```

`service_role` bypass toàn bộ RLS — file `.env` đã gitignore, đừng commit, đừng đưa vào app.

**2. Chạy thử 10 chương trước:**

```bash
pnpm crawl https://truyenfull.live/dai-phung-da-canh-nhan/ --limit 10
```

Truyện vào DB ở trạng thái **đã đăng** — mở `pnpm web` là đọc được ngay. Thêm `--draft`
nếu muốn để nháp rồi tự duyệt trong `pnpm admin`.

**3. Full truyện:** bỏ `--limit`. Chạy lại cùng lệnh nếu đứt giữa chừng — nó **skip chương đã có**
và tiếp từ chỗ dừng (resume-safe). Chạy lại để lấy chương mới của truyện đang ra cũng an toàn:
trạng thái đăng và ảnh bìa **không** bị ghi đè.

Ghi chú:
- Genre nguồn không có trong bảng seed → log và bỏ qua (không tạo genre rác).
- Credit dịch giả trong nội dung được **giữ nguyên**.
- Cloudflare bật JS challenge giữa chừng → dừng sạch, chạy lại lệnh để resume. Không có cơ chế
  vượt captcha (ngoài phạm vi).
- Pháp lý: crawl + đăng lại truyện dịch có bản quyền là quyết định của bạn.

## Những chỗ đã cố ý làm đơn giản

| Bỏ qua | Thêm khi nào |
|---|---|
| TanStack Query — mỗi màn tự fetch | Khi back tới back lui thấy chớp trắng khó chịu |
| NativeWind — dùng thẳng `constants/theme.ts` + `useBreakpoint()` | Khi số biến thể style vượt tầm kiểm soát |
| Bảng ratings — mới có `view_count` | Khi cần xếp hạng theo điểm người đọc |
| `chapter_count` denormalized | Chưa cần, đang dùng `chapters(count)` của PostgREST |
| Đăng nhập trong app đọc | Đọc không cần tài khoản; tủ truyện + tiến độ thì cần |
| Resize ảnh bìa | Đang upload nguyên bản, giới hạn 2MB. Thêm `sharp` khi băng thông thành vấn đề |

## Giới hạn đã biết: SEO của bản Expo web chỉ có phần khung

> **`apps/web` không dính giới hạn này.** Nó là app đọc cá nhân chạy local, render nội dung
> thật ở phía server — nhưng **không nhắm tới SEO** (xem [`docs/huong-dan-su-dung.md`](docs/huong-dan-su-dung.md)).
> Phần dưới chỉ còn đúng cho bản export web của `apps/mobile`.

Đã kiểm chứng bằng cách đọc `dist/index.html` sau khi export. Trong `<div id="root">` có:

```
Truyện · Trang chủ · Tủ truyện · Tìm truyện, tác giả…   ← header, render được
<spinner>                                              ← thân trang
```

Header render ở SSR, **thân trang thì không**. Mọi màn hình fetch dữ liệu trong `useEffect`
và render spinner trong lúc chờ, nên HTML tĩnh chỉ có khung điều hướng — không có tên
truyện, không có nội dung chương.

Bot không chạy JS sẽ index được menu chứ không index được thứ người ta tìm kiếm. Site
truyện sống bằng traffic organic vào trang chương, nên đây là hạn chế thật.

Ba đường đi tiếp, theo thứ tự công sức:

1. `generateStaticParams` trong route động → prerender HTML thật cho từng truyện. Đổi lại:
   mỗi lần đăng truyện mới phải rebuild, và build sẽ chậm dần theo số chương.
2. Đổi `web.output` sang `"server"`, deploy lên Node host → SSR theo request, không cần rebuild.
3. Cho Next.js admin phục vụ luôn trang đọc public (phương án đã cân nhắc lúc đầu) → SEO mạnh
   nhất nhưng phải viết hai lần UI reader.
