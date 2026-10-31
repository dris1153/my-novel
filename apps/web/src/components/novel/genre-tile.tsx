import Link from "next/link";

import { NovelCover } from "./novel-cover";

import { cn } from "@/lib/cn";
import type { GenreTile as Tile } from "@/lib/queries";

/** Ô thể loại: tên serif + số truyện, ghép tối đa 3 bìa thật xếp chồng nghiêng. */
export function GenreTile({ tile }: { tile: Tile }) {
  const empty = tile.count === 0;

  return (
    <Link
      href={`/the-loai/${tile.slug}`}
      className={cn(
        "group relative flex h-32 overflow-hidden rounded-card border border-line p-4 transition-colors hover:border-line-strong",
        empty ? "bg-subtle" : "bg-surface"
      )}>
      <div className="relative z-10 flex flex-col">
        <span className={cn("font-heading text-[17px] leading-tight font-semibold", empty ? "text-fg-2" : "text-fg")}>{tile.name}</span>
        <span className="mt-1 text-xs text-fg-2">{empty ? "Chưa có truyện" : `${tile.count} truyện`}</span>
      </div>

      <div aria-hidden className="absolute right-3 bottom-[-14px] flex">
        {tile.covers.map((novel, i) => (
          <div
            key={novel.slug}
            className="w-12"
            style={{ marginLeft: i === 0 ? 0 : -22, transform: `rotate(${(i - (tile.covers.length - 1) / 2) * 8}deg)` }}>
            <NovelCover uri={novel.coverUrl} title={novel.title} seed={novel.slug} color={novel.coverColor} sizes="48px" />
          </div>
        ))}
      </div>
    </Link>
  );
}
