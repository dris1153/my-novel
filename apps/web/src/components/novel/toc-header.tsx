import Link from "next/link";

import type { NovelDetail } from "@/lib/queries";

/** Đầu trang mục lục: quay về trang truyện + tên mục lục. Dùng chung cho trang 1 và các trang sau. */
export function TocHeader({ novel, page }: { novel: NovelDetail; page: number }) {
  return (
    <header>
      <Link
        href={`/truyen/${novel.slug}`}
        className="-ml-2 inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm text-accent-fg hover:bg-hover">
        <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 5l-7 7 7 7" />
        </svg>
        <span className="line-clamp-1">{novel.title}</span>
      </Link>
      <h1 className="mt-1 border-l-4 border-accent pl-3 font-heading text-2xl font-bold text-fg lg:text-3xl">
        Danh sách chương{page > 1 && <span className="text-fg-2"> · trang {page}</span>}
      </h1>
      <p className="mt-1 pl-4 text-sm text-fg-2">
        <span className="font-semibold text-hot-fg">{novel.chapterCount}</span> chương
      </p>
    </header>
  );
}
