import { notFound } from "next/navigation";
import { Suspense } from "react";

import { DocBadge, HomeHeading } from "@/components/home/home-heading";
import { PromoCard } from "@/components/home/promo-card";
import { ChapterListSkeleton } from "@/components/novel/chapter-list-skeleton";
import { ChapterPreview } from "@/components/novel/chapter-preview";
import { DescriptionAccordion } from "@/components/novel/description-accordion";
import { NovelActions } from "@/components/novel/novel-actions";
import { NovelHero } from "@/components/novel/novel-hero";
import { RelatedList } from "@/components/novel/related-list";
import { fetchByGenre, fetchNovel } from "@/lib/queries";

const PREVIEW_COUNT = 5;
const RELATED_COUNT = 5;

export const revalidate = 600;

export async function generateMetadata({ params }: PageProps<"/truyen/[slug]">) {
  const { slug } = await params;
  const novel = await fetchNovel(slug);
  if (!novel) return { title: "Không tìm thấy truyện" };

  return {
    title: novel.title,
    description: novel.description?.slice(0, 160) ?? `${novel.title} của ${novel.author}.`,
  };
}

export default async function NovelPage({ params }: PageProps<"/truyen/[slug]">) {
  const { slug } = await params;
  const novel = await fetchNovel(slug);
  if (!novel) notFound();

  // Thể loại chính = thể loại đầu trong meta (như trang chủ), không phải thứ tự trong index.
  const firstGenre = novel.genreList.find((g) => g.slug === novel.genres[0]) ?? novel.genreList[0] ?? null;
  const sameGenre = firstGenre ? await fetchByGenre(firstGenre.slug, RELATED_COUNT + 1) : [];
  const related = sameGenre.filter((n) => n.slug !== novel.slug).slice(0, RELATED_COUNT);

  return (
    <main className="mx-auto flex w-full max-w-[1860px] flex-col gap-5 px-4 lg:gap-6 lg:px-6">
      <NovelHero novel={novel} genre={firstGenre}>
        <NovelActions slug={novel.slug} />
      </NovelHero>

      <div className="grid gap-5 lg:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <div className="flex min-w-0 flex-col gap-5 lg:gap-6">
          {novel.description && (
            <section className="rounded-card bg-surface p-5 lg:p-6">
              <HomeHeading icon={<DocBadge />} title="Giới thiệu" className="mb-2" />
              <DescriptionAccordion text={novel.description} />
            </section>
          )}

          <section className="rounded-card bg-surface p-5 lg:p-6">
            <HomeHeading
              icon={<DocBadge />}
              title="Chương mới nhất"
              action={{ href: `/truyen/${novel.slug}/muc-luc`, label: `Mục lục (${novel.chapterCount}) →` }}
              className="mb-1"
            />
            <Suspense fallback={<ChapterListSkeleton rows={PREVIEW_COUNT} />}>
              <ChapterPreview slug={novel.slug} limit={PREVIEW_COUNT} />
            </Suspense>
          </section>
        </div>

        <aside className="flex flex-col gap-5 lg:gap-6">
          {firstGenre && related.length > 0 && <RelatedList novels={related} genreSlug={firstGenre.slug} />}
          <PromoCard />
        </aside>
      </div>
    </main>
  );
}
