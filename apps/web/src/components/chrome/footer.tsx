import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-10 text-sm text-ink-3">
        <Link href="/" className="font-serif text-base text-ink">
          Truyện
        </Link>

        <nav className="flex flex-wrap items-center gap-5">
          <Link href="/the-loai" className="hover:text-ink">
            Thể loại
          </Link>
          <Link href="/tu-truyen" className="hover:text-ink">
            Tủ truyện
          </Link>
          <Link href="/tim-kiem" className="hover:text-ink">
            Tìm kiếm
          </Link>
        </nav>

        <p>Nội dung do người dùng đăng tải.</p>
      </div>
    </footer>
  );
}
