import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ChapterListSkeleton } from "@/components/novel/chapter-list-skeleton";
import { TocHeader } from "@/components/novel/toc-header";
import { TocList } from "@/components/novel/toc-list";
import { fetchNovel } from "@/lib/queries";

export const revalidate = 600;

export async function generateMetadata({ params }: PageProps<"/truyen/[slug]/muc-luc">) {
  const { slug } = await params;
  const novel = await fetchNovel(slug);
  if (!novel) return { title: "Mục lục" };

  return {
    title: `Mục lục — ${novel.title}`,
  };
}

export default async function TocPage({ params }: PageProps<"/truyen/[slug]/muc-luc">) {
  const { slug } = await params;
  const novel = await fetchNovel(slug);
  if (!novel) notFound();

  return (
    <main className="mx-auto w-full max-w-[900px] px-4 pt-4 lg:pt-8">
      <TocHeader novel={novel} page={1} />
      <Suspense fallback={<ChapterListSkeleton rows={12} />}>
        <TocList slug={novel.slug} page={1} />
      </Suspense>
    </main>
  );
}
