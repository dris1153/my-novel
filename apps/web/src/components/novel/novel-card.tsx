import Link from "next/link";

import { NovelCover } from "./novel-cover";

import type { NovelCard } from "@/lib/queries";

const GRID_SIZES = "(min-width:1024px) 180px, (min-width:640px) 25vw, 33vw";

/** Thẻ lưới: bìa + tên (luôn hiện, không giấu trong alt) + số chương. */
export function NovelGridCard({ novel, priority }: { novel: NovelCard; priority?: boolean }) {
  return (
    <Link href={`/truyen/${novel.slug}`} className="group flex flex-col gap-2">
      <NovelCover
        uri={novel.coverUrl}
        title={novel.title}
        seed={novel.slug}
        color={novel.coverColor}
        sizes={GRID_SIZES}
        priority={priority}
      />
      <div className="min-w-0">
        <h3 className="line-clamp-2 font-serif text-[15px] leading-snug font-semibold text-fg transition-colors group-hover:text-accent-fg">
          {novel.title}
        </h3>
        <p className="mt-0.5 truncate text-xs text-fg-2">
          {novel.chapterCount} chương
        </p>
      </div>
    </Link>
  );
}

/** Lưới thẻ dùng chung: 3 cột điện thoại → 6 cột màn rộng. */
export function NovelGrid({ novels, priorityCount = 0 }: { novels: NovelCard[]; priorityCount?: number }) {
  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 lg:grid-cols-6 lg:gap-x-5">
      {novels.map((novel, index) => (
        <NovelGridCard key={novel.slug} novel={novel} priority={index < priorityCount} />
      ))}
    </div>
  );
}
