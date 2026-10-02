import { NOVEL_STATUS_LABEL, formatCount, timeAgo } from "shared";

import { NovelCover } from "./novel-cover";

import { DoodleLantern } from "@/components/doodles";
import { Tag } from "@/components/ui/tag";
import type { NovelDetail } from "@/lib/queries";

type Genre = { slug: string; name: string };

/** Hero truyện: panel ink-violet duy nhất của trang. */
export function NovelHero({
  novel,
  chapterTotal,
  genres,
}: {
  novel: NovelDetail;
  chapterTotal: number;
  genres: Genre[];
}) {
  return (
    <section className="relative overflow-hidden rounded-lg bg-violet p-6 text-on-violet md:p-8">
      <DoodleLantern
        size={150}
        rotate={-10}
        className="absolute -right-4 -bottom-8 text-[rgba(255,253,248,0.12)] md:right-4 md:bottom-0"
      />

      <div className="relative flex gap-5 md:gap-7">
        <div className="w-[104px] shrink-0 md:w-[140px]">
          <NovelCover
            uri={novel.cover_url}
            title={novel.title}
            seed={novel.slug}
            sizes="140px"
            priority
            className="border-[rgba(255,253,248,0.2)]"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="font-serif text-[26px] leading-[1.12] text-on-violet md:text-[36px]">
            {novel.title}
          </h1>
          <p className="mt-2 text-sm opacity-75">{novel.author}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <Tag className="border-[rgba(255,253,248,0.4)] text-on-violet">
              {NOVEL_STATUS_LABEL[novel.status]}
            </Tag>
            {genres.map((genre) => (
              <Tag
                key={genre.slug}
                className="border-[rgba(255,253,248,0.4)] text-on-violet">
                {genre.name}
              </Tag>
            ))}
          </div>

          <dl className="mt-5 flex gap-7">
            <Stat value={String(chapterTotal)} label="Chương" />
            <Stat value={formatCount(novel.view_count)} label="Lượt đọc" />
            <Stat value={timeAgo(novel.updated_at)} label="Cập nhật" />
          </dl>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dd className="font-serif text-[18px] text-on-violet">{value}</dd>
      <dt className="text-[11px] opacity-70">{label}</dt>
    </div>
  );
}
