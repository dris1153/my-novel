# Code review — UI revamp "Ngọc Lục" (`feat/ui-ngoc-luc`, chưa commit)

## Phạm vi
- So với `main`: 59 file sửa/xoá trong `apps/web` (+493/−651) và các file mới chưa track (`components/home/*`, `danh-sach/[kind]/**`, `lib/lists.ts`, `paged-novel-grid.tsx`, `chapter-nav-pair.tsx`, `illustration.tsx`, `search-form.tsx`, `genre-empty.tsx`, `format-date.ts(+test)`, `scripts/art-to-webp.mjs`, `src/assets/shortcuts/*`, `public/art/banner-*.webp`).
- Đã kiểm: `tsc --noEmit` (web) pass · `pnpm --filter web test` 32/32 pass · `eslint` sạch. **Chưa chạy** `next build`, chưa xem ảnh chụp màn hình.
- Grep orphan: `InkArt|ink-art|EmptyArt|GenreList|NextChapterCard|WelcomeBanner|iconOnly|font-serif|tint-|home-banner|ink-to-mask|Noto_Serif|f2b25c` → 0 kết quả (ngoài `plans/`).

## Đánh giá chung
Refactor gọn, đúng hướng plan. Không thấy lỗ hổng bảo mật hay rò nội dung qua cổng. Các lỗi chính nằm ở a11y của khu nền slate/carousel và một cặp tương phản mà `contrast.test.ts` không bắt được (trạng thái hover).

## Critical
Không có.

## High

### H1. Viền focus của link slide carousel bị cắt mất hoàn toàn
`components/home/hero-carousel.tsx:71` (link) trong `ul` `overflow-x-auto` (`:64`) và `section` `overflow-hidden` (`:56`).
- Link là `absolute inset-0` của `li` rộng đúng bằng khung cuộn. Outline mặc định `outline-offset: 2px` (globals.css:104-107) vẽ hoàn toàn **ngoài** hộp link, nên bị khung cuộn cắt sạch cả 4 cạnh.
- Lỗi xảy ra khi: người dùng bàn phím Tab vào trang chủ thì điểm dừng đầu tiên (slide 1, rồi tới slide 2…) không hề có dấu focus. Vi phạm WCAG 2.4.7.
- Cách sửa: vẽ viền vào trong, ví dụ thêm `-outline-offset-4` (Tailwind v4) vào className của Link. Nếu sợ viền trắng chìm trên vùng sáng của tranh, dùng thêm `outline-4`.

## Medium

### M1. Hover nút chính làm chữ trắng trên nền xanh tụt xuống 4.27:1 (light)
`components/ui/button.tsx:13`, `components/chrome/search-form.tsx:30`, `components/reader/chapter-nav-pair.tsx:46` đều dùng `hover:brightness-110`.
- Bình thường trắng trên `#15803d` đạt 5.02:1. Filter `brightness()` tính trên sRGB nên làm nền sáng lên, còn **4.27:1** (đã tính lại bằng node). Dark mode không bị (chữ tối trên nền sáng hơn, 7.93:1).
- Trước đây nút hổ phách có chữ tối nên làm sáng nền thì tương phản tăng. Giờ chữ trắng nên quy tắc cũ phản tác dụng. `contrast.test.ts` chỉ so token với token nên không bắt được.
- Cách sửa: thêm token `--accent-hover` (light `#166534`, đạt 7.13:1 với trắng; dark ví dụ `#4ade80`), dùng `hover:bg-accent-hover` và thêm cặp `["on-accent","accent-hover"]` vào test. Cách nhanh hơn: `hover:brightness-90 dark:hover:brightness-110`.

### M2. Carousel tự chạy: không có cách dừng trên cảm ứng, timer không reset, cờ pause dùng chung
`components/home/hero-carousel.tsx:38-48` và `:57-60`.
1. Vuốt tay (touch) không kích hoạt mouseenter/focus nên `paused` vẫn false, và interval không đặt lại khi `index` đổi. Ví dụ người dùng vuốt sang slide 2 ở giây 4.8 thì 0.2s sau carousel tự nhảy sang slide 3. Nếu interval chạy đúng lúc đang kéo, `scrollTo` sẽ giành cử chỉ của người dùng.
2. Một cờ `paused` dùng cho cả hover lẫn focus. Ví dụ người dùng bàn phím đang focus trong carousel, chuột lướt ngang qua rồi ra khỏi carousel thì `setPaused(false)`, và carousel tự quay ngay dưới focus. Ngoài ra `onBlurCapture` cũng chạy khi focus chỉ chuyển giữa các phần tử con.
3. Không có nút dừng/chạy (APG carousel yêu cầu; WCAG 2.2.2 mức A cho nội dung tự chuyển động quá 5s).
- Cách sửa (ít code): tách `hovered`/`focused`. Ở blur chỉ bỏ cờ khi `!e.currentTarget.contains(e.relatedTarget)`, giống mẫu sẵn có ở `reader-shell.tsx:111`. Thêm `onPointerDown={() => setStopped(true)}` để dừng hẳn sau tương tác đầu tiên. Thêm `index` vào deps của effect để timer bắt đầu lại sau mỗi lần chuyển. Muốn đạt đầy đủ 2.2.2 thì thêm một nút ⏸/▶ (24px như chấm là đủ theo 2.5.8).

### M3. Viền focus trên nền slate chỉ thấy được một phần
- Thanh nav desktop (`components/chrome/header.tsx:76`, `nav-link.tsx:19`): cạnh trên của viền nằm dưới header `sticky z-30` nên bị che. Cạnh dưới là viền trắng (`--on-bar`) trên nền trang `#f0f2f5`, chỉ 1.12:1 nên gần như vô hình. Kết quả là chỉ còn hai vạch dọc.
- GenrePanel (`components/home/genre-panel.tsx:11,17`): link rộng hết khung `overflow-y-auto` nên hai cạnh trái/phải bị cắt.
- Cách sửa chung (1 dòng CSS): `outline-offset: var(--focus-offset, 2px)` trong `:focus-visible` (globals.css:106), rồi đặt `[--focus-offset:-3px]` cạnh `[--focus-ring:var(--on-bar)]` ở nav slate, GenrePanel và link carousel. Cách này sửa luôn H1.
- Ghi chú: `genre-chips.tsx:11` (có từ trước) cũng là khung `overflow-x-auto` không có `py`, nên viền chip bị cắt trên/dưới.

### M4. Chip thể loại ở trang truyện chỉ cao khoảng 22px (trước khoảng 43px)
`components/novel/novel-hero.tsx:40-42`: `<Link>` bọc `<Tag className="px-2.5 py-1 text-xs">` (leading-none), chiều cao ≈ 12 + 8 + 2 = 22px.
- Vẫn qua WCAG 2.5.8 nhờ ngoại lệ khoảng cách, nhưng trái quy tắc dự án "chạm ≥44px". Trên điện thoại khó bấm đúng chip.
- Cách sửa: `className="inline-flex min-h-11 items-center"` trên Link (chip giữ nguyên dáng, vùng chạm lớn ra), hoặc tăng `gap-y` cho phù hợp.

## Low

- **L1. Khoảng trống ma 16px trên lưới trang chủ khi không có "Đang đọc".** Ở `app/(site)/page.tsx:50`, `lg:grid-cols-[220px_minmax(0,1fr)_auto]` vẫn giữ track `auto` rỗng cùng `gap-4`. Người dùng mới (ContinueReading trả `null`) sẽ thấy carousel lệch 16px so với mép phải của khối "Mới cập nhật" bên dưới. Sửa: `lg:grid-flow-col lg:grid-cols-[220px_minmax(0,1fr)] lg:auto-cols-[300px]` và bỏ `lg:w-[300px]` ở ContinueReading. Cột thứ 3 chỉ sinh ra khi có thẻ, và mẹo `lg:h-0 lg:min-h-full` của GenrePanel vẫn chạy.
- **L2. Trùng tên landmark.** `chapter-nav-pair.tsx:28` (cặp trên) và `reader-chrome.tsx:100` đều là `nav aria-label="Chuyển chương"`. Đổi cặp trên thành "Chuyển chương đầu trang".
- **L3. `aria-disabled` trên `<span>` không có role thì AT bỏ qua** (`chapter-nav-pair.tsx:41,50`; mẫu cũ ở `reader-chrome.tsx:140`). Trình đọc màn hình chỉ đọc "‹ Trước" như chữ thường. Bỏ thuộc tính, thêm `aria-hidden` (đã có link tương đương ở thanh dưới) hoặc chữ sr-only "(không có)".
- **L4. Hàng chấm của carousel chặn click.** `hero-carousel.tsx:111`: div `inset-x-0` cao 24px nằm đè lên link, nên dải đáy banner ngoài các chấm thành vùng chết. Thêm `pointer-events-none` cho wrapper và `pointer-events-auto` cho button.
- **L5. "Thể loại chính" không nhất quán.** `truyen/[slug]/page.tsx:34` lấy `genreList[0]`, mà `genreList` theo thứ tự của `index.genres` (`queries.ts:118`). Carousel và LatestList lại dùng `novel.genres[0]` (thứ tự của truyện). Kệ "cùng thể loại" có thể theo một thể loại khác với nhãn hiện ở trang chủ. Dùng `novel.genres[0]` để tìm.
- **L6. `parsePageParam` (`ui/page-nav.tsx:40`) dễ dãi** (logic cũ, chỉ dời chỗ): chấp nhận `"2.0"`, `"0x2"`, `"2e0"`, `" 2"`, nên cùng nội dung có nhiều URL. Trang quá xa (`/the-loai/x/trang/999`) hiện `GenreEmpty` "Thể loại này chưa có truyện…", dễ gây hiểu nhầm. Nên dùng `/^[1-9]\d*$/` và `notFound()` khi `page > 1` mà rỗng. Site có cổng đăng nhập nên SEO không quan trọng; đây chủ yếu là chuyện đúng/sai.
- **L7. Màu không qua token trên slate.** `genre-panel.tsx:17` và `nav-link.tsx:20` dùng `hover:bg-white/10`. Nên dùng `hover:bg-on-bar/10` để dark theme theo token.
- **L8. `themeColor: "#ffffff"` cố định** (`layout.tsx:31`), nên người dùng dark mode có thanh trình duyệt trắng. Dùng mảng theo `prefers-color-scheme` (light `#ffffff`, dark `#18191b`).
- **L9. Shelf mất ngữ nghĩa danh sách** (`shelf.tsx:19`, trước là `ul/li`, nay `div` + link). Trình đọc màn hình không còn báo "danh sách 8 mục". Đổi lại thành `ul`/`li`.
- **L10. Các cặp màu mới hiện đạt nhưng chưa có test giữ** (đã tính): fg-2/fg-3/accent-fg/hot-fg trên `hover` ở light đạt 5.20/**4.84**/6.25/5.67, ở dark fg-3 đạt 4.86. fg-2/fg-3 trên `accent-soft` (dòng đang đọc ở mục lục) đạt 5.41/5.03. `on-bar` /70, /80, /85 trên `bar` ≥ 6.88. Nên thêm `"hover"` vào `BACKGROUNDS` và thêm cặp fg-2/fg-3 trên accent-soft. fg-3 trên hover chỉ dư 0.34.
- **L11. Chữ trắng trên tranh banner** (cố ý). Đỉnh khối chữ nằm ở chỗ gradient chỉ còn khoảng 25–35% đen, nên với banner sáng thì dòng tác giả 13px (`text-white/85`) có thể dưới 4.5:1. Cần kiểm bằng ảnh chụp thật. Nếu thiếu thì nâng `via-black/35` lên khoảng `/55`.

## Bảo mật / cổng đăng nhập: không có phát hiện
- Mọi `next/image` có thể hiện trước đăng nhập (sign-in, error, not-found qua `/art/x` không tồn tại) đều là `unoptimized` + `/art/…`. Icon lối tắt import tĩnh nên đi qua `/_next/static/media/`, thuộc vùng được miễn.
- Banner `/art/banner-*.webp` công khai nhưng chỉ là tranh chung, không gắn với truyện nào, nên chấp nhận được.
- Route mới `/danh-sach/**` không bị loại khỏi matcher. Dữ liệu vẫn đi qua `github-store` (có `getAuthorizedUser`). `listFor` dùng `Object.hasOwn` nên `__proto__`/`constructor` cho 404. `basePath` chỉ được tạo sau khi đã kiểm `kind`.
- Client `HeroCarousel` chỉ import `next/image`, `next/link`, `NovelCover`, `cn`, không kéo module server/token. Không có `force-dynamic`. Trang chủ vẫn dùng `connection()`.

## Dead code / orphan
- Đã sạch (xem grep ở trên). `PAGE_SIZE` trong `paged-novel-grid.tsx:6` được export nhưng không ai import (vô hại).
- Trạng thái git lẫn lộn: vài file xoá đã stage (`D `), còn `home-banner.webp` và mọi file sửa thì chưa. Còn nhiều file chưa track (`src/assets/`, `public/art/banner-*`, `scripts/art-to-webp.mjs`, `danh-sach/`). Khi commit nhớ `git add` đủ, nếu không build sẽ thiếu import tĩnh.

## Hoàn thành theo plan
- `plan.md` vẫn ghi mọi phase là `pending` dù phase 1–7 đã làm, cần cập nhật trạng thái.
- AGENTS.md (DESIGN.md là "Thư viện đêm" dark-first, "Amber as text…", "`public/art/` ink-wash masks") và DESIGN.md đã lỗi thời, để phase 8 xử lý.
- Tiêu chí "carousel… reduced-motion tắt tự chạy" đã đạt. "Bàn phím được" chỉ đạt một phần vì có H1 và M2.
- Tổng dung lượng art + icon khoảng 795 KB, dưới mức ~900 KB.

## Hành động đề xuất (theo thứ tự)
1. H1 + M3: thêm biến `--focus-offset` và đặt giá trị âm ở các vùng slate/carousel.
2. M1: token `--accent-hover` + thêm cặp vào test.
3. M2: tách cờ hover/focus, dừng khi pointerdown, thêm `index` vào deps (cân nhắc nút dừng).
4. M4: vùng chạm 44px cho chip thể loại.
5. L1–L11 tuỳ thời gian. Sau đó chạy `pnpm --filter web build` và chụp 390/1440px.

## Câu hỏi còn mở
- Có chấp nhận dừng carousel bằng hover/focus thay cho nút dừng (WCAG 2.2.2) không, hay thêm nút?
- `featured.slice(0, 5)` với 4 banner thì slide thứ 5 lặp lại banner-1. Có cố ý không?

**Status:** DONE_WITH_CONCERNS
**Summary:** Typecheck/test/lint xanh, không có lỗ hổng bảo mật. Có 1 lỗi a11y High (viền focus slide carousel bị cắt), 4 Medium (tương phản hover nút chính 4.27:1, logic tự chạy/pause của carousel, viền focus trên nền slate, chip thể loại 22px).
**Concerns/Blockers:** Chưa chạy `next build` và chưa kiểm bằng ảnh chụp (L11).
