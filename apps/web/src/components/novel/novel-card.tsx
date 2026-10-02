import Link from "next/link";
import { timeAgo } from "shared";

import { NovelCover } from "./novel-cover";

import { chapterCount, type NovelCard } from "@/lib/queries";

const GRID_SIZES = "(min-width:1024px) 16vw, (min-width:640px) 30vw, 45vw";

export function NovelGridCard({ novel, priority }: { novel: NovelCard; priority?: boolean }) {
  return (
    <Link href={`/truyen/${novel.slug}`} className="group block">
      <NovelCover
        uri={novel.cover_url}
        title={novel.title}
        seed={novel.slug}
        sizes={GRID_SIZES}
        priority={priority}
      />
      <h3 className="mt-2 line-clamp-2 font-serif text-[16px] leading-[1.3] text-ink transition-colors group-hover:text-sepia-text">
        {novel.title}
      </h3>
      <p className="mt-1 text-xs text-ink-3">
        {chapterCount(novel)} chương · {timeAgo(novel.updated_at)}
      </p>
    </Link>
  );
}

export function NovelListRow({ novel }: { novel: NovelCard }) {
  return (
    <Link
      href={`/truyen/${novel.slug}`}
      className="group flex gap-4 border-t border-line py-4">
      <div className="w-12 shrink-0">
        <NovelCover
          uri={novel.cover_url}
          title={novel.title}
          seed={novel.slug}
          sizes="48px"
        />
      </div>
      <div className="min-w-0">
        <h3 className="truncate font-serif text-[17px] text-ink transition-colors group-hover:text-sepia-text">
          {novel.title}
        </h3>
        <p className="truncate text-sm text-ink-2">{novel.author}</p>
        <p className="mt-0.5 text-xs text-ink-3">
          {chapterCount(novel)} chương · {timeAgo(novel.updated_at)}
        </p>
      </div>
    </Link>
  );
}
