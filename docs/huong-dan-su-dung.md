# Hướng dẫn sử dụng

Web đọc truyện cho vài người quen, chạy trên Vercel. Truyện nằm trong repo GitHub private
`novel-data`; người chủ thêm truyện bằng CLI trên máy mình.

Cài đặt lần đầu (repo data, token, Google OAuth, env, deploy): xem [`README.md`](../README.md).
Trang này chỉ nói cách **dùng hằng ngày**.

---

## 1. Đăng nhập

Mở web → bấm **Đăng nhập bằng Google**. Chỉ email nằm trong `ALLOWED_EMAILS` mới vào được;
email khác sẽ thấy "Email này chưa được cấp quyền truy cập".

- Tủ truyện và tiến độ đọc lưu theo tài khoản, đồng bộ giữa các thiết bị.
- Thêm/bớt người dùng: sửa `ALLOWED_EMAILS` trên Vercel rồi redeploy. Email bị gỡ mất quyền
  ngay cả khi đang đăng nhập.

---

## 2. Thêm truyện (chỉ người chủ, trên máy tính)

```bash
pnpm crawl <url>                 # cả truyện (~1s/chương; 2000 chương ≈ 35 phút)
pnpm crawl <url> --limit 10      # thử 10 chương
```

Ví dụ URL: `https://truyenfull.live/dai-phung-da-canh-nhan/`

- CLI ghi file vào bản clone `novel-data` (đường dẫn trong `DATA_REPO_DIR` của `.env` gốc), cứ
  100 chương thì commit và push `main`. Web thấy truyện mới sau tối đa ~10 phút.
- `--limit` áp dụng **sau** khi bỏ qua chương đã có, nên mỗi lần chạy `--limit 10` sẽ lấy thêm
  10 chương tiếp theo — dùng để lấy dần.
- Chạy lại cùng URL để lấy chương mới của truyện đang ra, hoặc để tiếp tục sau khi bị ngắt.
  Đánh dấu đề cử (`featured`) và ảnh bìa cũ không bị ghi đè.
- Mỗi lần chỉ chạy một crawl trên cùng một clone.

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
| Cuộn | vị trí được lưu khi bạn ở lại chương vài giây, mỗi ~30 giây, và khi ẩn tab; mở lại đúng chỗ đã dừng |

Tuỳ chỉnh đọc (cỡ chữ, nền, kiểu chữ) lưu trên trình duyệt (`localStorage`), không đồng bộ giữa thiết bị.

---

## 4. Các trang

| Đường dẫn | Nội dung |
|---|---|
| `/` | "Đang đọc" + tất cả truyện (mới cập nhật trước) |
| `/tu-truyen` | Chỉ những truyện đã bấm ♡ |
| `/the-loai` | Duyệt theo thể loại |
| `/tim-kiem` | Tìm theo tên truyện hoặc tác giả (không cần gõ dấu) |
| `/toi` | Thông tin tài khoản, đăng xuất |

---

## 5. Sự cố thường gặp

| Hiện tượng | Xử lý |
|---|---|
| Crawl dừng, log có `ChallengeError` | truyenfull chặn tạm (Cloudflare). Chờ vài phút rồi chạy lại |
| Crawl báo `DATA_REPO_DIR … không dùng được` | Đường dẫn phải là thư mục gốc của clone `novel-data`, đang ở nhánh `main` |
| Log báo `genre không có trong index.json, bỏ qua: …` | Thêm thể loại đó vào `genres` trong `index.json` của repo data |
| Truyện crawl xong chưa hiện trên web | Chờ tối đa ~10 phút (cache) |
| Truyện không có ảnh bìa | Nguồn không có bìa hoặc tải thất bại; web dùng bìa màu sinh từ tên truyện |
| Vào web bị đẩy về trang đăng nhập liên tục | Email chưa có trong `ALLOWED_EMAILS` (hoặc biến đang trống) |
| Lỗi "Không đọc được index.json" | Sai `GITHUB_DATA_REPO` / `GITHUB_DATA_TOKEN`, hoặc token thiếu quyền trên repo |
| Trang trắng / lỗi thiếu env | Thiếu `apps/web/.env.local` — xem `README.md` |

---

## 6. Bảo mật

- Repo `novel-data` **luôn để private**: chứa truyện dịch có bản quyền.
- `GITHUB_DATA_TOKEN` có quyền ghi vào repo data. Chỉ đặt trong env của Vercel và `apps/web/.env.local`
  (gitignored), không bao giờ dùng tiền tố `NEXT_PUBLIC_`. Nghi ngờ lộ thì thu hồi token trên GitHub
  và tạo cái mới.
- Mọi trang và API đều đứng sau đăng nhập; nội dung không được index bởi công cụ tìm kiếm.
