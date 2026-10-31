import Link from "next/link";
import { NOVEL_STATUS_LABEL, timeAgo } from "shared";

import { NovelCover } from "./novel-cover";

import { Tag } from "@/components/ui/tag";
import type { NovelDetail } from "@/lib/queries";

/**
 * Đầu trang truyện kiểu TruyenYY: bìa trái, tên + tác giả bên phải. Bảng thông tin nằm dưới
 * (rộng hết khối) trên điện thoại, và vào cột phải dưới tên trên màn rộng.
 */
export function NovelHero({ novel }: { novel: NovelDetail }) {
  return (
    <div className="grid grid-cols-[104px_minmax(0,1fr)] gap-x-4 gap-y-4 min-[380px]:grid-cols-[120px_minmax(0,1fr)] lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-x-6 lg:gap-y-3">
      <div className="lg:row-span-2">
        <NovelCover
          uri={novel.coverUrl}
          title={novel.title}
          seed={novel.slug}
          color={novel.coverColor}
          sizes="180px"
          priority
        />
      </div>

      <div className="min-w-0">
        <h1 className="line-clamp-3 font-heading text-[22px] leading-snug font-bold text-fg lg:text-3xl">
          {novel.title}
        </h1>
        <p className="mt-1 text-sm font-medium text-fg-2">{novel.author}</p>
      </div>

      <dl className="col-span-2 grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 text-sm lg:col-span-1 lg:col-start-2 lg:self-start">
        {novel.genreList.length > 0 && (
          <>
            <dt className="text-fg-2">Thể loại</dt>
            <dd className="flex flex-wrap gap-x-1.5">
              {novel.genreList.map((genre) => (
                <Link key={genre.slug} href={`/the-loai/${genre.slug}`} className="inline-flex min-h-11 items-center">
                  <Tag className="px-2.5 py-1 text-xs">{genre.name}</Tag>
                </Link>
              ))}
            </dd>
          </>
        )}

        <dt className="text-fg-2">Trạng thái</dt>
        <dd>
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent-fg">
            {NOVEL_STATUS_LABEL[novel.status]}
          </span>
        </dd>

        <dt className="text-fg-2">Số chương</dt>
        <dd className="font-semibold text-hot-fg tabular-nums">{novel.chapterCount}</dd>

        <dt className="text-fg-2">Cập nhật</dt>
        <dd className="text-fg">{timeAgo(novel.updatedAt)}</dd>
      </dl>
    </div>
  );
}
