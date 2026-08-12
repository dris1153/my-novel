# Brainstorm — Redesign màn detail novel (admin) + sửa chương

Ngày: 2026-08-12 · Trạng thái: đã duyệt thiết kế

## Vấn đề

Trang `admin/novels/[id]` nhồi 4 khối xếp dọc (header, NovelForm, ChapterImport, danh sách
chương). Chương chỉ xoá được, KHÔNG sửa nội dung/tiêu đề. Query list còn chẳng lấy `content`.

## Bản chất (2 việc)

- **Phân tab**: thuần frontend, tách khối nhồi.
- **Sửa chương**: NĂNG LỰC MỚI — cần action + editor + route. Đây là giá trị thật (crawler nhập
  2000+ chương có thể dính rác parse, hiện không sửa được lỗi chính tả nào).

## Quyết định (đã chốt)

| Câu | Chốt |
|---|---|
| Surface editor | Trang riêng `/chapters/[id]` (textarea lớn cho nội dung dài) |
| Tab | 2 tab: Thông tin / Chương (import gộp vào tab Chương) |
| Thêm chương thủ công | CÓ — dùng chung editor, `/chapters/new` gợi số = max+1 |
| Import trong tab Chương | collapse (mặc định ẩn) |
| Font textarea | Literata (soát chính tả sát runtime reader) |

## Kiến trúc

1. **`novels/[id]/page.tsx`** (Server Component, giữ fetch novel+genres+chapters) → thêm client
   `<NovelDetailTabs>`: tab text+underline (Opennote Tab Navigation), useState toggle (không URL),
   2 slot: info = NovelForm, chapters = list + import(collapse) + "+ Thêm chương". Header trên tab.
2. **Danh sách chương**: mỗi dòng click tiêu đề → editor; nút Xoá giữ. Query list vẫn nhẹ (no content).
3. **Editor route mới**: `/novels/[id]/chapters/[chapterId]` (sửa) + `/chapters/new` (thêm), cùng
   `<ChapterEditor>`: số chương + tiêu đề + textarea Literata + CTA sepia "Lưu".
4. **Action mới `saveChapter`**: upsert `(novel_id, number)`, recompute word_count (countWords),
   bắt lỗi 23505 (số trùng), requireAdmin + revalidate.

## Rủi ro / hạn chế

1. Rời trang mất nội dung (no beforeunload guard) — v1 bỏ qua.
2. Đổi số chương gây trùng → action trả lỗi rõ, không để 23505 văng thô.
3. Tab useState → back mất tab đang chọn. Chấp nhận cho admin.

## KHÔNG làm (YAGNI)

Prev/next trong editor · autosave · version history · rich-text · unsaved-guard.

## Success criteria

- 2 tab hoạt động, Opennote (underline, serif heading, sepia CTA).
- Click chương → editor, sửa nội dung/tiêu đề → lưu → word_count cập nhật.
- "+ Thêm chương" tạo chương mới với số gợi ý.
- Số chương trùng → lỗi rõ, không crash.
- typecheck + admin build sạch.
