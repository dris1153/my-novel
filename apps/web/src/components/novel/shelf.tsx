import Link from "next/link";

import { NovelCover } from "./novel-cover";

import { SectionHeading } from "@/components/ui/section-heading";
import type { NovelCard } from "@/lib/queries";

/** Kệ cuộn ngang (snap) — tràn ra mép màn hình điện thoại cho cảm giác còn nữa. */
export function Shelf({
  title,
  novels,
  action,
}: {
  title: string;
  novels: NovelCard[];
  action?: { href: string; label: string };
}) {
  return (
    <section>
      <SectionHeading title={title} action={action} className="mb-3" />
      <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:px-0">
        {novels.map((novel) => (
          <li key={novel.slug} className="w-[104px] shrink-0 snap-start lg:w-[132px]">
            <Link href={`/truyen/${novel.slug}`} className="group flex flex-col gap-2">
              <NovelCover
                uri={novel.coverUrl}
                title={novel.title}
                seed={novel.slug}
                color={novel.coverColor}
                sizes="132px"
              />
              <span className="line-clamp-2 font-serif text-sm leading-snug font-semibold text-fg group-hover:text-accent-fg">
                {novel.title}
              </span>
              <span className="-mt-1 text-xs text-fg-2">{novel.chapterCount} chương</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
