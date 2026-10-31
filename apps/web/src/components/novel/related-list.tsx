import Link from "next/link";

import { NovelCover } from "./novel-cover";

import { HomeHeading, StarBadge } from "@/components/home/home-heading";
import type { NovelCard } from "@/lib/queries";

/** Thẻ peach cột phải: vài truyện cùng thể loại chính, mỗi dòng bìa nhỏ + tên + tác giả. */
export function RelatedList({ novels, genreSlug }: { novels: NovelCard[]; genreSlug: string }) {
  return (
    <section className="rounded-card bg-tint-peach p-5 lg:p-6">
      <HomeHeading icon={<StarBadge />} title="Truyện cùng thể loại" action={{ href: `/the-loai/${genreSlug}`, label: "Xem thêm →" }} />
      <ul className="mt-2">
        {novels.map((novel) => (
          <li key={novel.slug} className="border-b border-fg/10 last:border-b-0">
            <Link href={`/truyen/${novel.slug}`} className="group flex items-center gap-4 py-3">
              <div className="w-14 shrink-0">
                <NovelCover uri={novel.coverUrl} title={novel.title} seed={novel.slug} color={novel.coverColor} sizes="56px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-heading text-[15px] leading-snug font-extrabold text-fg group-hover:text-accent-fg">{novel.title}</p>
                <p className="mt-0.5 truncate text-sm text-fg-2">{novel.author}</p>
              </div>
              <span aria-hidden className="shrink-0 text-lg text-fg-2">›</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
