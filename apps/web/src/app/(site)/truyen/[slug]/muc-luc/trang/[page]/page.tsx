import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ChapterListSkeleton } from "@/components/novel/chapter-list-skeleton";
import { TocHeader } from "@/components/novel/toc-header";
import { TocList } from "@/components/novel/toc-list";
import { fetchNovel } from "@/lib/queries";

export const revalidate = 600;

function readPage(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 2 ? n : null;
}

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
  const current = readPage(page);
  if (current === null) notFound();

  const novel = await fetchNovel(slug);
  if (!novel) notFound();

  return (
    <main className="mx-auto w-full max-w-[900px] px-4 pt-4 lg:pt-8">
      <TocHeader novel={novel} page={current} />
      <Suspense fallback={<ChapterListSkeleton rows={12} />}>
        <TocList slug={novel.slug} page={current} />
      </Suspense>
    </main>
  );
}
