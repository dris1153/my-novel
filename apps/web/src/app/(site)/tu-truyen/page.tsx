import { DoodleBook } from "@/components/doodles";
import { NovelGridCard } from "@/components/novel/novel-card";
import { ButtonLink } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import type { NovelCard } from "@/lib/queries";

export const metadata = {
  title: "Tủ truyện",
  robots: { index: false, follow: true },
};

export default async function LibraryPage() {
  const { supabase, user } = await requireUser();

  const { data } = await supabase
    .from("library")
    .select(
      "novels(id, slug, title, author, cover_url, status, view_count, updated_at, featured, chapters(count))"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const novels = ((data ?? []) as unknown as { novels: NovelCard | null }[])
    .map((row) => row.novels)
    .filter((novel): novel is NovelCard => novel !== null);

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 pt-10">
      <h1 className="font-serif text-[32px] leading-[1.12] text-ink">Tủ truyện</h1>

      {novels.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <DoodleBook size={88} rotate={-6} wash />
          <p className="mt-6 text-sm text-ink-2">Chưa có truyện nào trong tủ.</p>
          <p className="mt-1 text-sm text-ink-3">Bấm ♡ ở trang truyện để lưu lại.</p>
          <div className="mt-6">
            <ButtonLink variant="ghost" href="/">
              Khám phá truyện
            </ButtonLink>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {novels.map((novel) => (
            <NovelGridCard key={novel.id} novel={novel} />
          ))}
        </div>
      )}
    </main>
  );
}
