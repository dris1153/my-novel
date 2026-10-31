import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ChapterListSkeleton } from "@/components/novel/chapter-list-skeleton";
import { ChapterPreview } from "@/components/novel/chapter-preview";
import { DescriptionAccordion } from "@/components/novel/description-accordion";
import { NovelActions } from "@/components/novel/novel-actions";
import { NovelHero } from "@/components/novel/novel-hero";
import { Shelf } from "@/components/novel/shelf";
import { SectionHeading } from "@/components/ui/section-heading";
import { fetchByGenre, fetchFirstChapterNumber, fetchNovel } from "@/lib/queries";

const PREVIEW_COUNT = 5;
const RELATED_COUNT = 8;

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
  const [firstNumber, sameGenre] = await Promise.all([
    fetchFirstChapterNumber(novel.slug),
    firstGenre ? fetchByGenre(firstGenre.slug, RELATED_COUNT + 1) : Promise.resolve([]),
  ]);
  const related = sameGenre.filter((n) => n.slug !== novel.slug).slice(0, RELATED_COUNT);

  return (
    <main className="mx-auto flex w-full max-w-[1000px] flex-col gap-4 px-4 pt-4 lg:px-6 lg:pt-6">
      <section className="rounded-card bg-surface p-4 lg:p-6">
        <NovelHero novel={novel} />
        <NovelActions slug={novel.slug} firstNumber={firstNumber} />
      </section>

      {novel.description && (
        <section className="rounded-card bg-surface p-4 lg:p-6">
          <SectionHeading title="Giới thiệu" className="mb-1" />
          <DescriptionAccordion text={novel.description} />
        </section>
      )}

      <section className="rounded-card bg-surface p-4 lg:p-6">
        <SectionHeading
          title="Chương mới nhất"
          action={{ href: `/truyen/${novel.slug}/muc-luc`, label: `Mục lục (${novel.chapterCount}) →` }}
          className="mb-1"
        />
        <Suspense fallback={<ChapterListSkeleton rows={PREVIEW_COUNT} />}>
          <ChapterPreview slug={novel.slug} limit={PREVIEW_COUNT} />
        </Suspense>
      </section>

      {firstGenre && related.length > 0 && (
        <Shelf
          title="Truyện cùng thể loại"
          novels={related}
          action={{ href: `/the-loai/${firstGenre.slug}`, label: "Thêm →" }}
        />
      )}
    </main>
  );
}
