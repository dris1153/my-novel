import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ChapterListSkeleton } from "@/components/novel/chapter-list-skeleton";
import { ChapterPreview } from "@/components/novel/chapter-preview";
import { DescriptionAccordion } from "@/components/novel/description-accordion";
import { NovelActions } from "@/components/novel/novel-actions";
import { NovelHero } from "@/components/novel/novel-hero";
import { PageCrumbs } from "@/components/ui/page-nav";
import { SubHeading } from "@/components/ui/section-heading";
import { fetchFirstChapterNumber, fetchNovel } from "@/lib/queries";

const PREVIEW_COUNT = 50;

export const revalidate = 600;

export async function generateMetadata({ params }: PageProps<"/truyen/[slug]">) {
  const { slug } = await params;
  const novel = await fetchNovel(slug);
  if (!novel) return { title: "Không tìm thấy truyện" };

  return {
    title: novel.title,
    description:
      novel.description?.slice(0, 160) ??
      `${novel.title} của ${novel.author} — đọc truyện online.`,
  };
}

export default async function NovelPage({ params }: PageProps<"/truyen/[slug]">) {
  const { slug } = await params;
  const novel = await fetchNovel(slug);
  if (!novel) notFound();

  const firstNumber = await fetchFirstChapterNumber(novel.slug);

  const chapterTotal = novel.chapterCount;

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 pt-10">
      <PageCrumbs items={[{ href: "/", label: "Trang chủ" }, { label: novel.title }]} />

      <NovelHero novel={novel} chapterTotal={chapterTotal} genres={novel.genreList} />

      <div className="mt-8">
        <NovelActions slug={novel.slug} firstNumber={firstNumber} />
      </div>

      {novel.description && <DescriptionAccordion text={novel.description} />}

      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SubHeading>Danh sách chương ({chapterTotal})</SubHeading>
          {chapterTotal > PREVIEW_COUNT && (
            <Link href={`/truyen/${novel.slug}/muc-luc`} className="text-sm text-sepia-text hover:underline">
              Xem mục lục đầy đủ ›
            </Link>
          )}
        </div>

        <div className="mt-4">
          <Suspense fallback={<ChapterListSkeleton />}>
            <ChapterPreview slug={novel.slug} limit={PREVIEW_COUNT} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
