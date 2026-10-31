import Link from "next/link";
import { NOVEL_STATUS_LABEL, timeAgo } from "shared";

import { NovelCover } from "./novel-cover";

import { Tag } from "@/components/ui/tag";
import type { NovelDetail } from "@/lib/queries";

/** Đầu trang truyện: bìa lớn ở giữa, tên serif, thông tin dạng chữ, chip thể loại. */
export function NovelHero({ novel }: { novel: NovelDetail }) {
  return (
    <section className="flex flex-col items-center text-center">
      <div className="w-[136px] lg:w-[168px]">
        <NovelCover
          uri={novel.coverUrl}
          title={novel.title}
          seed={novel.slug}
          color={novel.coverColor}
          sizes="168px"
          priority
          className="shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
        />
      </div>

      <h1 className="mt-5 font-serif text-[22px] leading-tight font-bold text-fg lg:text-3xl">{novel.title}</h1>
      <p className="mt-1.5 text-sm text-fg-2">{novel.author}</p>
      <p className="mt-1 text-[13px] text-fg-2">
        {NOVEL_STATUS_LABEL[novel.status]} · {novel.chapterCount} chương · cập nhật {timeAgo(novel.updatedAt)}
      </p>

      {novel.genreList.length > 0 && (
        <ul className="mt-3 flex flex-wrap justify-center gap-x-2">
          {novel.genreList.map((genre) => (
            <li key={genre.slug}>
              <Link href={`/the-loai/${genre.slug}`} className="inline-block py-1.5">
                <Tag>{genre.name}</Tag>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
