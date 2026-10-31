import Link from "next/link";

import { NovelCover } from "./novel-cover";

import type { NovelCard } from "@/lib/queries";

const GRID_SIZES = "(min-width:1280px) 190px, (min-width:768px) 22vw, (min-width:640px) 30vw, 45vw";

/** Thẻ lưới trong khối trắng: bìa + tên đậm 2 dòng + tác giả xám. */
function NovelGridCard({ novel, priority }: { novel: NovelCard; priority?: boolean }) {
  return (
    <Link href={`/truyen/${novel.slug}`} className="group flex h-full flex-col gap-2 rounded-[20px] bg-surface p-2 pb-3 shadow-sm">
      <NovelCover
        uri={novel.coverUrl}
        title={novel.title}
        seed={novel.slug}
        color={novel.coverColor}
        sizes={GRID_SIZES}
        priority={priority}
      />
      <div className="min-w-0 px-1">
        <h3 className="line-clamp-2 font-heading text-[15px] leading-snug font-bold text-fg transition-colors group-hover:text-accent-fg">
          {novel.title}
        </h3>
        <p className="mt-0.5 truncate text-xs text-fg-2">{novel.author}</p>
      </div>
    </Link>
  );
}

/** Lưới thẻ dùng chung: 2 cột điện thoại → 6 cột màn rộng. */
export function NovelGrid({ novels, priorityCount = 0 }: { novels: NovelCard[]; priorityCount?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4 xl:grid-cols-6">
      {novels.map((novel, index) => (
        <NovelGridCard key={novel.slug} novel={novel} priority={index < priorityCount} />
      ))}
    </div>
  );
}
