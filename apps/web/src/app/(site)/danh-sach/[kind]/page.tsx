import { notFound } from "next/navigation";
import { Suspense } from "react";

import { NovelGridSkeleton } from "@/components/novel/novel-grid-skeleton";
import { PagedNovelGrid } from "@/components/novel/paged-novel-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { listFor } from "@/lib/lists";

export const revalidate = 600;

export async function generateMetadata({ params }: PageProps<"/danh-sach/[kind]">) {
  const { kind } = await params;
  return { title: listFor(kind)?.title ?? "Danh sách" };
}

export default async function ListPage({ params }: PageProps<"/danh-sach/[kind]">) {
  const { kind } = await params;
  const list = listFor(kind);
  if (!list) notFound();

  return (
    <main className="mx-auto flex w-full max-w-[1320px] flex-col gap-4 px-4 lg:px-6">
      <h1 className="border-l-4 border-accent pl-3 font-heading text-2xl font-bold text-fg lg:text-3xl">{list.title}</h1>
      <Suspense fallback={<NovelGridSkeleton />}>
        <PagedNovelGrid
          load={list.load}
          basePath={`/danh-sach/${kind}`}
          page={1}
          empty={<EmptyState art="no-results" title="Chưa có truyện nào" />}
        />
      </Suspense>
    </main>
  );
}
