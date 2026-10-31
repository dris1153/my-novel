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

Trang chủ → bấm bìa truyện → trang chi tiết (đầu trang nhuộm theo màu bìa):

| Nút | Việc |
|---|---|
| **Đọc từ đầu** / **Đọc tiếp chương N** (thanh dưới cùng) | vào chương; tự đổi thành "Đọc tiếp" khi đang đọc dở |
| **♡** (cạnh nút đọc) | theo dõi — truyện vào tủ truyện, có báo số chương mới |
| **Xem thêm** | mở mô tả dài |
| Chương mới nhất | 5 chương mới nhất; chương đang đọc được đánh dấu |
| **Mục lục (N)** | toàn bộ chương, chia trang, đúng thứ tự đọc |

Trong trình đọc:

| Thao tác | Kết quả |
|---|---|
| Chạm vào chữ | hiện / ẩn thanh điều khiển (tự ẩn sau 3 giây và khi cuộn xuống, hiện lại khi cuộn lên) |
| `←` `→` hoặc nút ‹ › ở thanh dưới | chương trước / chương sau |
| `Aa` | **nền** (Giấy / Ngả vàng / Đêm / Đen tuyền), **cỡ chữ** (6 mức), **kiểu chữ** (có chân / không chân), **giãn dòng** (Hẹp / Vừa / Rộng) |
| Biểu tượng mục lục | nhảy tới chương bất kỳ |
| Cuối chương | nút **Đọc chương tiếp** |
| Cuộn | vị trí được lưu khi bạn ở lại chương vài giây, mỗi ~30 giây, và khi ẩn tab; mở lại đúng chỗ đã dừng |

Tuỳ chỉnh đọc lưu trên trình duyệt (`localStorage`), không đồng bộ giữa thiết bị.

---

## 4. Các trang

Trên điện thoại, 4 tab ở đáy màn hình: **Trang chủ · Thể loại · Tủ truyện · Tôi**; tìm kiếm là kính lúp ở góc trên.

| Đường dẫn | Nội dung |
|---|---|
| `/` | "Đang đọc" + chip thể loại + kệ "Mới cập nhật" + tất cả truyện (A→Z) |
| `/tu-truyen` | Hai tab: **Đang đọc** (tiến độ từng truyện) và **Theo dõi** (truyện đã bấm ♡). Badge **+N** = số chương mới ra từ lần bạn đọc/theo dõi gần nhất; đọc một chương là badge tắt |
| `/the-loai` | Ô thể loại kèm bìa truyện thật |
| `/tim-kiem` | Tìm theo tên truyện hoặc tác giả (không cần gõ dấu) |
| `/toi` | Tài khoản, **giao diện Tự động / Sáng / Tối**, đăng xuất |

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
