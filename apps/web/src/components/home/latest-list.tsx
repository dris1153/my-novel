import Link from "next/link";

import { SectionHeading } from "@/components/ui/section-heading";
import { formatDay } from "@/lib/format-date";
import type { NovelCard } from "@/lib/queries";

/** Bảng "Mới cập nhật" dạng chữ cho màn rộng: tên · thể loại · số chương (đỏ) · ngày. */
export function LatestList({
  novels,
  genreNames,
  className,
}: {
  novels: NovelCard[];
  genreNames: Map<string, string>;
  className?: string;
}) {
  return (
    <section className={className}>
      <SectionHeading
        title="Truyện mới cập nhật"
        action={{ href: "/danh-sach/moi-cap-nhat", label: "Thêm →" }}
        className="mb-1"
      />
      <ul className="divide-y divide-line">
        {novels.map((novel) => (
          <li key={novel.slug} className="grid grid-cols-[minmax(0,1fr)_140px_110px_56px] items-center gap-3 py-2.5 text-sm">
            <Link href={`/truyen/${novel.slug}`} className="truncate font-medium text-fg hover:text-accent-fg">
              {novel.title}
            </Link>
            <span className="truncate text-fg-2">{genreNames.get(novel.genres[0] ?? "") ?? ""}</span>
            <span className="text-hot-fg tabular-nums">Chương {novel.chapterCount}</span>
            <span className="text-right text-fg-3 tabular-nums">{formatDay(novel.updatedAt)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
