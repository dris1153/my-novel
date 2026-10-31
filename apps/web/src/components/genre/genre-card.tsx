import Image from "next/image";
import Link from "next/link";

import { NovelCover } from "@/components/novel/novel-cover";
import { genreInfo } from "@/lib/genre-info";
import type { GenreTile } from "@/lib/queries";

/** Ô thể loại kiểu thẻ pastel: tranh riêng ở trên tan vào màu ô, tên + số truyện, vài bìa thật xoè ở góc. */
export function GenreCard({ tile }: { tile: GenreTile }) {
  const info = genreInfo(tile.slug);

  return (
    <Link
      href={`/the-loai/${tile.slug}`}
      style={info ? ({ "--tile": info.tint } as React.CSSProperties) : undefined}
      // Đơn vị cqw: chữ và bìa giữ đúng tỉ lệ với ô ở mọi số cột.
      className="group @container relative block aspect-[7/8] overflow-hidden rounded-card bg-tile">
      {info && (
        <div className="absolute inset-x-0 top-0 aspect-[3/2] overflow-hidden mask-b-from-50%">
          <Image
            src={info.thumb}
            alt=""
            fill
            sizes="(min-width:1280px) 260px, (min-width:640px) 30vw, 50vw"
            // Ảnh art đã nén sẵn; `/_next/image` nằm sau cổng đăng nhập.
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
          />
        </div>
      )}
      <div className="absolute inset-x-[7cqw] bottom-[42cqw]">
        <p className="font-heading text-[clamp(1.25rem,10cqw,2rem)] leading-tight font-extrabold text-on-tile">{tile.name}</p>
        <p className="mt-0.5 text-[clamp(0.875rem,6.5cqw,1.125rem)] text-on-tile-2">
          {tile.count > 0 ? `${tile.count} truyện` : "Chưa có truyện"}
        </p>
      </div>
      {tile.covers.length > 0 && (
        <div aria-hidden className="absolute right-[6cqw] bottom-[6cqw] flex">
          {tile.covers.map((novel, i) => (
            <div
              key={novel.slug}
              className="w-[24cqw] rounded-cover shadow-lg ring-2 ring-white/90"
              style={{ marginLeft: i === 0 ? 0 : "-7cqw", transform: `rotate(${i === 0 ? -8 : 7}deg)` }}>
              <NovelCover uri={novel.coverUrl} title={novel.title} seed={novel.slug} color={novel.coverColor} sizes="64px" />
            </div>
          ))}
        </div>
      )}
    </Link>
  );
}
