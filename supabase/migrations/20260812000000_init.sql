-- Novel reader — schema khởi tạo
-- Chạy: npm run db:reset (local) hoặc supabase db push (remote)

create extension if not exists unaccent;
create extension if not exists pg_trgm;

-- ── enums ────────────────────────────────────────────────────────────
create type novel_status as enum ('ongoing', 'completed', 'hiatus');
create type user_role   as enum ('reader', 'admin');

-- ── profiles ─────────────────────────────────────────────────────────
create table profiles (
  id           uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_url   text,
  role         user_role not null default 'reader',
  created_at   timestamptz not null default now()
);

create function handle_new_user() returns trigger
  language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users for each row execute function handle_new_user();

-- Tách ra SECURITY DEFINER để policy trên `profiles` không tự truy vấn `profiles` -> đệ quy RLS.
create function is_admin() returns boolean
  language sql security definer stable set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  ) $$;

-- ── catalog ──────────────────────────────────────────────────────────
create table genres (
  id   smallint generated always as identity primary key,
  slug text not null unique,
  name text not null
);

create table novels (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null check (length(trim(title)) > 0),
  author      text not null check (length(trim(author)) > 0),
  description text,
  cover_url   text,
  status      novel_status not null default 'ongoing',
  published   boolean not null default false,
  view_count  bigint not null default 0,
  created_at  timestamptz not null default now(),
  -- Được trigger bump khi có chương mới; là khoá sort cho "Mới cập nhật".
  updated_at  timestamptz not null default now()
);

create table novel_genres (
  novel_id uuid     not null references novels on delete cascade,
  genre_id smallint not null references genres on delete cascade,
  primary key (novel_id, genre_id)
);

create table chapters (
  id         uuid primary key default gen_random_uuid(),
  novel_id   uuid not null references novels on delete cascade,
  number     integer not null check (number > 0),
  title      text not null,
  content    text not null,
  word_count integer not null default 0,
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (novel_id, number)
);

-- ── per-user ─────────────────────────────────────────────────────────
create table library (
  user_id    uuid not null references auth.users on delete cascade,
  novel_id   uuid not null references novels on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, novel_id)
);

create table reading_progress (
  user_id    uuid not null references auth.users on delete cascade,
  novel_id   uuid not null references novels on delete cascade,
  chapter_id uuid not null references chapters on delete cascade,
  -- 0..1, vị trí cuộn trong chương để mở lại đúng chỗ
  percent    real not null default 0 check (percent between 0 and 1),
  updated_at timestamptz not null default now(),
  primary key (user_id, novel_id)
);

-- ── indexes ──────────────────────────────────────────────────────────
create index novels_updated_idx on novels (updated_at desc) where published;
create index novels_views_idx   on novels (view_count desc) where published;
create index novels_title_trgm  on novels using gin (title gin_trgm_ops);
create index chapters_novel_idx on chapters (novel_id, number);
create index novel_genres_genre on novel_genres (genre_id);
create index library_user_idx   on library (user_id, created_at desc);
create index progress_user_idx  on reading_progress (user_id, updated_at desc);

-- ── triggers ─────────────────────────────────────────────────────────
create function touch_updated_at() returns trigger
  language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger novels_touch before update on novels
  for each row execute function touch_updated_at();
create trigger chapters_touch before update on chapters
  for each row execute function touch_updated_at();

-- Chương mới -> truyện nhảy lên đầu "Mới cập nhật".
create function bump_novel_updated() returns trigger
  language plpgsql security definer set search_path = '' as $$
begin
  update public.novels set updated_at = now()
  where id = coalesce(new.novel_id, old.novel_id);
  return null;
end $$;

create trigger chapters_bump_novel
  after insert or delete on chapters
  for each row execute function bump_novel_updated();

-- Đếm lượt đọc: RPC vì client không có quyền UPDATE trên novels.
create function increment_view(p_novel_id uuid) returns void
  language sql security definer set search_path = '' as $$
  update public.novels set view_count = view_count + 1 where id = p_novel_id;
$$;

-- ── RLS ──────────────────────────────────────────────────────────────
alter table profiles         enable row level security;
alter table genres           enable row level security;
alter table novels           enable row level security;
alter table novel_genres     enable row level security;
alter table chapters         enable row level security;
alter table library          enable row level security;
alter table reading_progress enable row level security;

create policy "profiles: đọc/sửa hồ sơ của mình"
  on profiles for select using ((select auth.uid()) = id or is_admin());
create policy "profiles: cập nhật hồ sơ của mình"
  on profiles for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "genres: ai cũng đọc được" on genres for select using (true);
create policy "genres: admin toàn quyền"  on genres for all using (is_admin()) with check (is_admin());

create policy "novels: chỉ thấy truyện đã đăng"
  on novels for select using (published or is_admin());
create policy "novels: admin toàn quyền"
  on novels for all using (is_admin()) with check (is_admin());

create policy "novel_genres: theo truyện đã đăng"
  on novel_genres for select
  using (exists (select 1 from novels n where n.id = novel_id and (n.published or is_admin())));
create policy "novel_genres: admin toàn quyền"
  on novel_genres for all using (is_admin()) with check (is_admin());

-- Chương ẩn của truyện ẩn đều không lộ ra ngoài.
create policy "chapters: chỉ chương đã đăng của truyện đã đăng"
  on chapters for select
  using (
    is_admin() or (
      published and exists (select 1 from novels n where n.id = novel_id and n.published)
    )
  );
create policy "chapters: admin toàn quyền"
  on chapters for all using (is_admin()) with check (is_admin());

create policy "library: chỉ của mình"
  on library for all
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "reading_progress: chỉ của mình"
  on reading_progress for all
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- ── seed thể loại ────────────────────────────────────────────────────
insert into genres (slug, name) values
  ('tien-hiep','Tiên hiệp'), ('kiem-hiep','Kiếm hiệp'), ('ngon-tinh','Ngôn tình'),
  ('do-thi','Đô thị'),       ('trinh-tham','Trinh thám'), ('huyen-huyen','Huyền huyễn'),
  ('khoa-huyen','Khoa huyễn'), ('tam-ly','Tâm lý'),      ('gia-dinh','Gia đình'),
  ('lich-su','Lịch sử');
