import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ChapterListSkeleton } from "@/components/novel/chapter-list-skeleton";
import { TocHeader } from "@/components/novel/toc-header";
import { TocList } from "@/components/novel/toc-list";
import { parsePageParam } from "@/components/ui/page-nav";
import { fetchNovel } from "@/lib/queries";

export const revalidate = 600;

export async function generateMetadata({ params }: PageProps<"/truyen/[slug]/muc-luc/trang/[page]">) {
  const { slug, page } = await params;
  const novel = await fetchNovel(slug);
  if (!novel) return { title: "Mục lục" };

  return {
    title: `Mục lục — ${novel.title} (trang ${page})`,
  };
}

export default async function TocPagedPage({ params }: PageProps<"/truyen/[slug]/muc-luc/trang/[page]">) {
  const { slug, page } = await params;
  const current = parsePageParam(page);
  if (current === null) notFound();

  const novel = await fetchNovel(slug);
  if (!novel) notFound();

  return (
    <main className="mx-auto flex w-full max-w-[1860px] flex-col gap-5 px-4 lg:gap-6 lg:px-6">
      <TocHeader novel={novel} page={current} />
      <Suspense fallback={<ChapterListSkeleton rows={12} />}>
        <TocList slug={novel.slug} page={current} />
      </Suspense>
    </main>
  );
}
