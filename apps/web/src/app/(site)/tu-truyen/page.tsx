import { DoodleBook } from "@/components/doodles";
import { NovelGridCard } from "@/components/novel/novel-card";
import { ButtonLink } from "@/components/ui/button";
import { fetchNovelCards } from "@/lib/queries";
import { readMyState } from "@/lib/state-store";

export const metadata = {
  title: "Tủ truyện",
  robots: { index: false, follow: true },
};

export default async function LibraryPage() {
  const { library } = await readMyState();
  const novels = await fetchNovelCards(library.map((e) => e.slug));

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
            <NovelGridCard key={novel.slug} novel={novel} />
          ))}
        </div>
      )}
    </main>
  );
}
