import Image from "next/image";
import Link from "next/link";

import { genreInfo } from "@/lib/genre-info";

/** Đầu trang một thể loại: tranh của thể loại bên phải, tên + số truyện + câu giới thiệu bên trái. */
export function GenreHeader({ slug, name, count, page }: { slug: string; name: string; count: number; page: number }) {
  const info = genreInfo(slug);

  return (
    <section className="relative overflow-hidden rounded-card bg-tint-sky [--focus-offset:-3px]">
      {info && (
        <Image
          src={info.art}
          alt=""
          fill
          sizes="(min-width:1024px) 1100px, 100vw"
          priority
          // Ảnh art đã nén sẵn; `/_next/image` nằm sau cổng đăng nhập.
          unoptimized
          className="object-cover object-[right_20%]"
        />
      )}
      {/* Phủ theo màu nền trang để chữ theo token đọc được ở cả 2 theme. */}
      <div className="absolute inset-0 bg-gradient-to-r from-canvas/95 via-canvas/80 via-85% to-canvas/30 sm:via-55% sm:to-transparent sm:to-90%" />
      <div className="relative flex min-h-[200px] max-w-[85%] flex-col items-start justify-center gap-1.5 p-5 sm:max-w-[55%] lg:min-h-[240px] lg:p-8">
        <Link
          href="/the-loai"
          className="inline-flex min-h-11 items-center gap-1 rounded-full bg-surface px-4 text-sm font-semibold text-fg hover:bg-hover">
          Thể loại <span aria-hidden>›</span>
        </Link>
        <h1 className="mt-1 font-heading text-3xl leading-tight font-extrabold text-fg lg:text-5xl">
          {name}
          {page > 1 && <span className="text-2xl text-fg-2 lg:text-3xl"> · trang {page}</span>}
        </h1>
        <p className="text-lg font-bold text-fg">{count > 0 ? `${count} truyện` : "Chưa có truyện"}</p>
        {info && <p className="text-sm text-fg-2 lg:text-[15px]">{info.tagline}</p>}
      </div>
      <Image
        src="/art/mascot-cat.webp"
        alt=""
        width={130}
        height={134}
        unoptimized
        className="absolute right-6 bottom-2 hidden lg:block"
      />
    </section>
  );
}
