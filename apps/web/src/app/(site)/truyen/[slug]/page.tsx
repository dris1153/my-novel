import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ChapterListSkeleton } from "@/components/novel/chapter-list-skeleton";
import { ChapterPreview } from "@/components/novel/chapter-preview";
import { DescriptionAccordion } from "@/components/novel/description-accordion";
import { NovelActions } from "@/components/novel/novel-actions";
import { NovelHero } from "@/components/novel/novel-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { fetchFirstChapterNumber, fetchNovel } from "@/lib/queries";

const PREVIEW_COUNT = 5;

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

  const firstNumber = await fetchFirstChapterNumber(novel.slug);
  const tint = novel.coverColor ?? "#3b4f6b";

  return (
    <main className="relative">
      {/* Nền nhuộm màu bìa, nhạt dần về màu trang — mỗi truyện một tông riêng. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[440px]"
        style={{
          backgroundImage: `radial-gradient(90% 80% at 50% 0%, color-mix(in srgb, ${tint} var(--tint-hero), transparent), transparent)`,
        }}
      />

      <div className="relative mx-auto w-full max-w-[760px] px-4 pt-6 lg:pt-10">
        <NovelHero novel={novel} />

        {novel.description && (
          <section className="mt-8">
            <h2 className="sr-only">Giới thiệu</h2>
            <DescriptionAccordion text={novel.description} />
          </section>
        )}

        <section className="mt-8">
          <SectionHeading
            title="Chương mới nhất"
            action={{ href: `/truyen/${novel.slug}/muc-luc`, label: `Mục lục (${novel.chapterCount})` }}
            className="mb-2"
          />
          <Suspense fallback={<ChapterListSkeleton rows={PREVIEW_COUNT} />}>
            <ChapterPreview slug={novel.slug} limit={PREVIEW_COUNT} />
          </Suspense>
        </section>
      </div>

      <NovelActions slug={novel.slug} firstNumber={firstNumber} />
    </main>
  );
}
