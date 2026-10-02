# Hướng dẫn sử dụng

Dành cho **một người dùng, chạy ở localhost**. App để lưu và đọc lại truyện đã crawl về
database của mình — không phải site truyện công khai.

Cài đặt lần đầu (Supabase, env, tài khoản admin): xem [`README.md`](../README.md).
Trang này chỉ nói cách **dùng hằng ngày**.

---

## 1. Chạy app

```bash
pnpm web
```

Mở **http://localhost:3000** → bấm **Đăng nhập** (góc phải) → `admin@skymail.ink` / `TestAdmin123!`

Đăng nhập **một lần** thôi, cookie sống lâu. Cần đăng nhập vì tủ truyện và tiến độ đọc
lưu theo tài khoản (`library`, `reading_progress`), RLS chặn theo `user_id`.

---

## 2. Thêm truyện

Ở ô trên cùng trang chủ:

```
Dán link truyện trên truyenfull…          [ Lấy về ]
```

Ví dụ: `https://truyenfull.live/dai-phung-da-canh-nhan/`

Bấm **Lấy về**:

- Crawl chạy **nền** — không phải chờ, UI không bị khoá.
- Mục **"Đang lấy về"** hiện số chương đang về, cập nhật mỗi 2 giây.
- Truyện **tự động được đăng** — không có bước duyệt nháp.
- Đọc được **ngay** khi có chương đầu tiên, phần còn lại chạy tiếp.

Crawl chạy **độc lập với web server**: đóng browser hay tắt `pnpm web` thì nó vẫn tiếp tục.
Mở lại rồi dán lại **cùng URL** là nó **resume** — bỏ qua chương đã có, không làm lại từ đầu.

---

## 3. Đọc

Trang chủ → bấm bìa truyện → trang chi tiết:

| Nút | Việc |
|---|---|
| **Đọc từ đầu** / **Đọc tiếp chương N** | vào chương; tự đổi thành "Đọc tiếp" khi đang đọc dở |
| **♡ Theo dõi** | lưu vào tủ truyện |
| **Mô tả truyện** | bấm để mở / thu gọn |
| Danh sách chương | 50 chương mới nhất |
| **Xem mục lục đầy đủ ›** | toàn bộ chương, chia trang, đúng thứ tự đọc |

Trong trình đọc:

| Thao tác | Kết quả |
|---|---|
| `←` `→` | chương trước / chương sau (bàn phím) |
| `Aa` | chỉnh **cỡ chữ** (6 mức), **nền** (Giấy / Ngả vàng / Đêm / Đen tuyền), **kiểu chữ** (Literata / Inter) |
| `Mục lục` | nhảy tới chương bất kỳ |
| Cuộn | **tự lưu vị trí** mỗi 5 giây; mở lại đúng chỗ đã dừng |

Thanh tiến độ nằm sát mép trên. Thanh công cụ tự ẩn khi cuộn xuống.
Tuỳ chỉnh đọc lưu trên máy (`localStorage`), không cần đăng nhập.

---

## 4. Các trang khác

| Đường dẫn | Nội dung |
|---|---|
| `/` | Thư viện: đang đọc + đang lấy về + tất cả truyện |
| `/tu-truyen` | Chỉ những truyện đã bấm ♡ |
| `/the-loai` | Duyệt theo thể loại |
| `/tim-kiem` | Tìm theo tên truyện hoặc tác giả |
| `/toi` | Đổi tên hiển thị, đăng xuất |

---

## 5. Dùng CLI (thay cho ô dán URL)

```bash
pnpm crawl <url>                 # cả truyện (~1s/chương; 2000 chương ≈ 35 phút)
pnpm crawl <url> --limit 10      # thử 10 chương
pnpm crawl <url> --draft         # để nháp thay vì tự đăng
```

`--limit` áp dụng **sau** khi bỏ qua chương đã có, nên mỗi lần chạy `--limit 10` sẽ lấy
thêm 10 chương tiếp theo — dùng để lấy dần.

Chạy lại cùng URL bất cứ lúc nào để lấy chương mới của truyện đang ra. An toàn: trạng thái
đăng và ảnh bìa **không** bị ghi đè.

CLI đọc `.env` ở **root** (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) — file này gitignored
và **chỉ** dành cho crawler, không đưa vào env của `apps/web` hay `apps/admin`.

---

## 6. Sự cố thường gặp

| Hiện tượng | Xử lý |
|---|---|
| Mục "Đang lấy về" biến mất nhưng truyện chưa đủ chương | Bình thường — phần hiển thị nằm trong bộ nhớ server, restart là mất. Dán lại URL để chạy tiếp (resume) |
| Crawl dừng, log có `ChallengeError` | truyenfull chặn tạm (Cloudflare). Chờ vài phút rồi chạy lại |
| Truyện không có ảnh bìa | Chưa cấu hình R2 — dùng bìa màu sinh từ tên truyện |
| Log báo `genre không có trong DB, bỏ qua: …` | Thể loại nguồn chưa có trong bảng `genres` |
| Trang trắng / lỗi env | Thiếu `apps/web/.env.local` — xem `README.md` |
| Bấm "Lấy về" không phản hồi | Kiểm đã đăng nhập chưa (form yêu cầu đăng nhập) |

---

## 7. Bảo mật

`SUPABASE_SERVICE_ROLE_KEY` trong root `.env` **bypass toàn bộ RLS** — đọc/ghi/xoá được mọi
thứ trong database.

- Không commit. Không copy sang `apps/web/.env.local` hay `apps/admin/.env.local`.
- Chỉ dùng cho `pnpm crawl` và tiến trình con của nó.
- Nghi ngờ lộ thì vào Dashboard → API Keys → rotate, rồi sửa lại một dòng trong root `.env`.

---

## 8. Những thứ còn trong code nhưng không cần dùng

| | Ghi chú |
|---|---|
| `pnpm admin` (`apps/admin`) | Đã revert về nguyên trạng; vẫn chạy được nếu muốn sửa truyện/chương bằng tay |
| Đăng ký công khai (`/dang-ky`) | Không cần cho 1 người; Supabase còn bật "Confirm email" nên cũng khó tự đăng ký |
| Sitemap / SEO / `robots.txt` | Vô nghĩa khi chỉ chạy localhost |
| Cột `novels.featured` | Panel "Đề cử tuần" đã bỏ khỏi trang chủ |
