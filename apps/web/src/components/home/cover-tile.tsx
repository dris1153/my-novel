import Link from "next/link";

import { NovelCover } from "@/components/novel/novel-cover";
import type { NovelCard } from "@/lib/queries";

/** Thẻ bìa có tên đè lên lớp phủ tối ở đáy; lớp phủ cố định vì bìa thật có đủ màu, kể cả chữ sẵn. */
export function CoverTile({ novel, sizes }: { novel: NovelCard; sizes: string }) {
  return (
    <Link href={`/truyen/${novel.slug}`} className="group relative block overflow-hidden rounded-cover">
      <NovelCover uri={novel.coverUrl} title={novel.title} seed={novel.slug} color={novel.coverColor} sizes={sizes} />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent px-3 pt-10 pb-3">
        <p className="line-clamp-2 font-heading text-sm leading-snug font-bold text-white group-hover:underline">{novel.title}</p>
      </div>
    </Link>
  );
}
