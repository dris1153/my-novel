import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ChapterListSkeleton } from "@/components/novel/chapter-list-skeleton";
import { PageCrumbs } from "@/components/ui/page-nav";
import { TocList } from "@/components/novel/toc-list";
import { fetchNovel } from "@/lib/queries";

export const revalidate = 600;

export async function generateMetadata({ params }: PageProps<"/truyen/[slug]/muc-luc">) {
  const { slug } = await params;
  const novel = await fetchNovel(slug);
  if (!novel) return { title: "Mục lục" };

  return {
    title: `Mục lục — ${novel.title}`,
    alternates: { canonical: `/truyen/${novel.slug}/muc-luc` },
  };
}

export default async function TocPage({ params }: PageProps<"/truyen/[slug]/muc-luc">) {
  const { slug } = await params;
  const novel = await fetchNovel(slug);
  if (!novel) notFound();

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 pt-10">
      <PageCrumbs
        items={[
          { href: "/", label: "Trang chủ" },
          { href: `/truyen/${novel.slug}`, label: novel.title },
          { label: "Mục lục" },
        ]}
      />
      <h1 className="font-serif text-[32px] leading-[1.12] text-ink">
        Mục lục <span className="text-ink-3">— {novel.title}</span>
      </h1>
      <Suspense fallback={<ChapterListSkeleton rows={12} />}>
        <TocList slug={novel.slug} novelId={novel.id} page={1} />
      </Suspense>
    </main>
  );
}
