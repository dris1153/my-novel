import { notFound } from "next/navigation";
import { Suspense } from "react";

import { NovelGridSkeleton } from "@/components/novel/novel-grid-skeleton";
import { PagedNovelGrid } from "@/components/novel/paged-novel-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { parsePageParam } from "@/components/ui/page-nav";
import { listFor } from "@/lib/lists";

export const revalidate = 600;

export async function generateMetadata({ params }: PageProps<"/danh-sach/[kind]/trang/[page]">) {
  const { kind, page } = await params;
  return { title: `${listFor(kind)?.title ?? "Danh sách"} — trang ${page}` };
}

export default async function ListPagedPage({ params }: PageProps<"/danh-sach/[kind]/trang/[page]">) {
  const { kind, page } = await params;
  const list = listFor(kind);
  const current = parsePageParam(page);
  if (!list || current === null) notFound();

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 pt-4 lg:px-6 lg:pt-6">
      <h1 className="border-l-4 border-accent pl-3 font-heading text-2xl font-bold text-fg lg:text-3xl">
        {list.title} <span className="text-fg-2">· trang {current}</span>
      </h1>
      <Suspense fallback={<NovelGridSkeleton />}>
        <PagedNovelGrid
          load={list.load}
          basePath={`/danh-sach/${kind}`}
          page={current}
          empty={<EmptyState art="no-results" title="Không còn truyện ở trang này" />}
        />
      </Suspense>
    </main>
  );
}
