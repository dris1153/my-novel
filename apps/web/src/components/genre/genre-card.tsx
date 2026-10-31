import Image from "next/image";
import Link from "next/link";

import { NovelCover } from "@/components/novel/novel-cover";
import { genreInfo } from "@/lib/genre-info";
import type { GenreTile } from "@/lib/queries";

/** Ô thể loại: tranh riêng của thể loại, tên + số truyện trên lớp phủ, vài bìa thật xoè ở góc. */
export function GenreCard({ tile }: { tile: GenreTile }) {
  const info = genreInfo(tile.slug);

  return (
    <Link
      href={`/the-loai/${tile.slug}`}
      className="group relative flex aspect-[7/8] flex-col justify-end overflow-hidden rounded-card bg-tint-lavender p-4 sm:pb-9">
      {info && (
        <Image
          src={info.thumb}
          alt=""
          fill
          sizes="(min-width:1280px) 240px, (min-width:640px) 30vw, 50vw"
          // Ảnh art đã nén sẵn; `/_next/image` nằm sau cổng đăng nhập.
          unoptimized
          className="object-cover object-top transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
        />
      )}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-surface via-surface/90 to-transparent" />
      <div className="relative">
        <p className="font-heading text-lg leading-tight font-extrabold text-fg">{tile.name}</p>
        <p className="mt-0.5 text-sm text-fg-2">{tile.count > 0 ? `${tile.count} truyện` : "Chưa có truyện"}</p>
      </div>
      {tile.covers.length > 0 && (
        <div aria-hidden className="absolute right-3 -bottom-3 hidden sm:flex">
          {tile.covers.map((novel, i) => (
            <div
              key={novel.slug}
              className="w-11 drop-shadow-md"
              style={{ marginLeft: i === 0 ? 0 : -14, transform: `rotate(${i === 0 ? -6 : 6}deg)` }}>
              <NovelCover uri={novel.coverUrl} title={novel.title} seed={novel.slug} color={novel.coverColor} sizes="44px" />
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}
