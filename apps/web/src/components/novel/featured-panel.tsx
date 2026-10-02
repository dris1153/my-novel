import { NovelCover } from "./novel-cover";

import { DoodleQuill } from "@/components/doodles";
import { ButtonLink } from "@/components/ui/button";
import { chapterCount, type FeaturedNovel } from "@/lib/queries";

/** Panel ink-violet — "reset moment" của trang: MỘT panel duy nhất mỗi màn. */
export function FeaturedPanel({ novel }: { novel: FeaturedNovel }) {
  return (
    <section className="relative overflow-hidden rounded-lg bg-violet p-6 text-on-violet md:p-10">
      <DoodleQuill
        size={140}
        rotate={12}
        className="absolute -right-4 -bottom-6 text-[rgba(255,253,248,0.14)] md:-right-2 md:bottom-2"
      />

      <div className="relative flex flex-col gap-6 md:flex-row md:gap-7">
        <div className="w-24 shrink-0 md:w-[120px]">
          <NovelCover
            uri={novel.cover_url}
            title={novel.title}
            seed={novel.slug}
            sizes="120px"
            className="border-[rgba(255,253,248,0.2)]"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] tracking-[0.08em] uppercase opacity-70">
            Đề cử tuần này
          </p>
          <h2 className="mt-2 font-serif text-[26px] leading-[1.12] text-on-violet md:text-[42px]">
            {novel.title}
          </h2>
          <p className="mt-2 text-sm opacity-75">
            {novel.author} · {chapterCount(novel)} chương
          </p>
          {novel.description && (
            <p className="mt-4 line-clamp-3 max-w-[52ch] text-body leading-relaxed opacity-85">
              {novel.description}
            </p>
          )}
          <div className="mt-6">
            <ButtonLink variant="ghost-light" href={`/truyen/${novel.slug}`}>
              Đọc từ đầu
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
