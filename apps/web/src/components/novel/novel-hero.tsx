import Image from "next/image";
import Link from "next/link";
import { NOVEL_STATUS_LABEL, timeAgo } from "shared";

import { NovelCover } from "./novel-cover";

import { genreInfo } from "@/lib/genre-info";
import type { Genre, NovelDetail } from "@/lib/queries";

const SMALL = { width: 16, height: 16, viewBox: "0 0 24 24", "aria-hidden": true, fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Stat({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-surface/80 px-3.5 text-sm font-medium text-fg">
      <span className="text-fg-2">{icon}</span>
      {children}
    </span>
  );
}

/**
 * Đầu trang truyện: tranh thể loại chính làm nền (phủ màu thẻ để chữ đọc được ở cả 2 theme),
 * bìa nghiêng, tên + tác giả, thể loại theo màu ô thể loại, vài số liệu; hàng nút do `children` truyền vào.
 */
export function NovelHero({ novel, genre, children }: { novel: NovelDetail; genre: Genre | null; children: React.ReactNode }) {
  const art = genre && genreInfo(genre.slug)?.art;

  return (
    <section className="relative overflow-hidden rounded-card bg-tint-lavender">
      {art && (
        <Image
          src={art}
          alt=""
          fill
          sizes="(min-width:1024px) 1400px, 100vw"
          priority
          // Ảnh art đã nén sẵn; `/_next/image` nằm sau cổng đăng nhập.
          unoptimized
          className="object-cover object-[right_25%]"
        />
      )}
      {/* Chỉ để lộ tranh khi cột chữ đã chừa lề phải (xl); hẹp hơn thì chữ trải hết bề ngang nên phủ kín. */}
      <div className="absolute inset-0 bg-tint-lavender/90 xl:bg-transparent xl:bg-gradient-to-r xl:from-tint-lavender xl:from-40% xl:via-tint-lavender/85 xl:via-60% xl:to-tint-lavender/0" />
      <div className="relative grid grid-cols-[104px_minmax(0,1fr)] gap-x-4 gap-y-4 p-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-x-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-x-8 lg:p-8 xl:pr-[26%]">
        <div className="self-start drop-shadow-lg sm:row-span-2 sm:-rotate-2">
          <NovelCover uri={novel.coverUrl} title={novel.title} seed={novel.slug} color={novel.coverColor} sizes="200px" priority />
        </div>

        <div className="min-w-0">
          <h1 className="line-clamp-3 font-heading text-2xl leading-tight font-extrabold text-balance text-fg sm:text-3xl lg:text-[44px]">
            {novel.title}
          </h1>
          <p className="mt-1 text-base text-fg-2 lg:mt-2 lg:text-xl">{novel.author}</p>
        </div>

        <div className="col-span-2 flex min-w-0 flex-col gap-4 sm:col-span-1 sm:col-start-2">
          {novel.genreList.length > 0 && (
            <ul className="flex flex-wrap gap-x-2">
              {novel.genreList.map((g) => {
                const tint = genreInfo(g.slug)?.tint;
                return (
                  <li key={g.slug}>
                    <Link href={`/the-loai/${g.slug}`} className="group inline-flex min-h-11 items-center">
                      <span
                        style={tint ? ({ "--tile": tint } as React.CSSProperties) : undefined}
                        className="rounded-full bg-tile px-4 py-1.5 text-sm font-semibold text-on-tile group-hover:brightness-95">
                        {g.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="flex flex-wrap gap-2">
            <Stat icon={<svg {...SMALL}><path d="M12 6.5C10.5 5 8 4.5 4 4.5v14c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-14c-4 0-6.5.5-8 2zM12 6.5v14" /></svg>}>
              {novel.chapterCount} chương
            </Stat>
            <Stat icon={<svg {...SMALL}><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></svg>}>
              {NOVEL_STATUS_LABEL[novel.status]}
            </Stat>
            <Stat icon={<svg {...SMALL}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>}>
              Cập nhật {timeAgo(novel.updatedAt)}
            </Stat>
          </div>

          {children}
        </div>
      </div>
      <Image
        src="/art/cat-sleeping.webp"
        alt=""
        width={520}
        height={356}
        unoptimized
        className="absolute right-6 bottom-0 hidden w-[220px] xl:block"
      />
    </section>
  );
}
