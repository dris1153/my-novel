import Image from "next/image";
import Link from "next/link";

import { NovelCover } from "./novel-cover";

import type { NovelDetail } from "@/lib/queries";

/** Đầu trang mục lục: bìa nhỏ + nút quay về truyện + tiêu đề "Mục lục". Dùng chung cho trang 1 và các trang sau. */
export function TocHeader({ novel, page }: { novel: NovelDetail; page: number }) {
  return (
    <header className="relative flex items-center gap-4 overflow-hidden rounded-card bg-tint-lavender p-5 sm:pr-44 lg:gap-6 lg:p-6 lg:pr-56">
      <div className="w-16 shrink-0 lg:w-20">
        <NovelCover uri={novel.coverUrl} title={novel.title} seed={novel.slug} color={novel.coverColor} sizes="80px" />
      </div>
      <div className="min-w-0">
        <Link
          href={`/truyen/${novel.slug}`}
          className="inline-flex min-h-11 max-w-full items-center gap-1 rounded-full bg-surface px-4 text-sm font-semibold text-fg hover:bg-hover">
          <span aria-hidden>‹</span>
          <span className="truncate">{novel.title}</span>
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-extrabold text-fg lg:text-4xl">
          Mục lục{page > 1 && <span className="text-fg-2"> · trang {page}</span>}
        </h1>
        <p className="mt-1 text-sm text-fg-2">{novel.chapterCount} chương</p>
      </div>
      <Image
        src="/art/cat-reading.webp"
        alt=""
        width={200}
        height={240}
        unoptimized
        className="absolute right-6 -bottom-3 hidden w-[120px] sm:block lg:right-10 lg:w-[150px]"
      />
    </header>
  );
}
