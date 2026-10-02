-- Đề cử tuần: admin gắn cờ, web dùng làm panel ink-violet ở trang chủ.
-- Chưa gắn cờ nào thì web fallback về top view_count.

alter table novels add column featured boolean not null default false;

-- Truy vấn chính: truyện đang đề cử, mới cập nhật trước.
create index novels_featured_idx on novels (updated_at desc) where published and featured;
