import Link from "next/link";
import { notFound } from "next/navigation";
import { timeAgo } from "shared";

import { ChapterImport } from "@/components/chapter-import";
import { NovelDetailTabs } from "@/components/novel-detail-tabs";
import { NovelForm } from "@/components/novel-form";
import { deleteChapter, deleteNovel } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";

export default async function EditNovelPage({
  params,
  searchParams,
}: PageProps<"/novels/[id]">) {
  const { id } = await params;
  const { tab } = await searchParams;
  const { supabase } = await requireAdmin();

  const [{ data: novel }, { data: genres }, { data: chapters }] = await Promise.all([
    supabase.from("novels").select("*, novel_genres(genre_id)").eq("id", id).single(),
    supabase.from("genres").select("id, slug, name").order("name"),
    supabase
      .from("chapters")
      .select("id, number, title, word_count, created_at")
      .eq("novel_id", id)
      .order("number", { ascending: false }),
  ]);

  if (!novel) notFound();

  const selectedGenreIds = (novel.novel_genres ?? []).map((g) => g.genre_id);
  const chapterList = chapters ?? [];

  const chaptersPanel = (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-ink-2 hover:text-sienna">
            Import hàng loạt (.txt)
          </summary>
          <div className="mt-3">
            <ChapterImport novelId={novel.id} />
          </div>
        </details>
        <Link
          href={`/novels/${novel.id}/chapters/new`}
          className="rounded-lg bg-sienna px-4 py-2.5 text-sm font-semibold text-white"
        >
          + Thêm chương
        </Link>
      </div>

      {chapterList.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-ink-2">
          Chưa có chương nào.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          {chapterList.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-0"
            >
              <Link
                href={`/novels/${novel.id}/chapters/${c.id}`}
                className="min-w-0 flex-1 hover:text-sienna"
              >
                <p className="truncate text-sm font-medium">
                  Chương {c.number} — {c.title}
                </p>
                <p className="text-xs text-ink-3">
                  {c.word_count} từ · {timeAgo(c.created_at)}
                </p>
              </Link>
              <form action={deleteChapter}>
                <input type="hidden" name="id" value={c.id} />
                <input type="hidden" name="novel_id" value={novel.id} />
                <button type="submit" className="text-xs font-semibold text-ink-3 hover:text-sienna">
                  Xoá
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/" className="text-sm text-ink-2 hover:text-sienna">
            ‹ Tất cả truyện
          </Link>
          <h1 className="font-serif text-2xl tracking-tight">{novel.title}</h1>
        </div>
        <form action={deleteNovel}>
          <input type="hidden" name="id" value={novel.id} />
          <button
            type="submit"
            className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink-2 hover:border-sienna hover:text-sienna"
          >
            Xoá truyện
          </button>
        </form>
      </div>

      <NovelDetailTabs
        defaultTab={tab === "chuong" ? "chuong" : "info"}
        chapterCount={chapterList.length}
        info={<NovelForm genres={genres ?? []} novel={novel} selectedGenreIds={selectedGenreIds} />}
        chuong={chaptersPanel}
      />
    </>
  );
}
