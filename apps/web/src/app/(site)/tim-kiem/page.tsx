import { SearchIcon } from "@/components/chrome/nav-items";
import { GenreChips } from "@/components/novel/genre-chips";
import { NovelGrid } from "@/components/novel/novel-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageNav } from "@/components/ui/page-nav";
import { fetchGenreTiles, searchNovels } from "@/lib/queries";

const PAGE_SIZE = 24;

export const metadata = {
  title: "Tìm kiếm",
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: PageProps<"/tim-kiem">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const rawPage = typeof sp.page === "string" ? Number(sp.page) : 1;
  const page = Number.isInteger(rawPage) && rawPage > 1 ? rawPage : 1;

  const [rows, tiles] = await Promise.all([
    q ? searchNovels(q, PAGE_SIZE + 1, (page - 1) * PAGE_SIZE) : Promise.resolve([]),
    q ? Promise.resolve([]) : fetchGenreTiles(),
  ]);
  const hasMore = rows.length > PAGE_SIZE;
  const results = rows.slice(0, PAGE_SIZE);

  const hrefFor = (target: number) => `/tim-kiem?q=${encodeURIComponent(q)}${target > 1 ? `&page=${target}` : ""}`;

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 pt-6 lg:px-6 lg:pt-10">
      <h1 className="sr-only">Tìm kiếm</h1>

      <form action="/tim-kiem" method="get" role="search" className="flex gap-2">
        <label className="flex min-h-12 flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-fg-2 focus-within:border-accent-fg">
          <SearchIcon />
          <input
            name="q"
            defaultValue={q}
            placeholder="Tìm truyện, tác giả… (không cần dấu)"
            aria-label="Từ khoá tìm kiếm"
            autoFocus
            className="min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-fg-3"
          />
        </label>
        <Button type="submit" className="min-h-12">
          Tìm
        </Button>
      </form>

      {q === "" ? (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-fg-2">Duyệt theo thể loại</h2>
          <GenreChips genres={tiles.filter((tile) => tile.count > 0)} />
        </section>
      ) : results.length === 0 ? (
        <EmptyState
          art="no-results"
          title="Không tìm thấy truyện"
          description={`Không có truyện nào khớp “${q}”. Thử tên ngắn hơn hoặc tên tác giả.`}
        />
      ) : (
        <>
          <p className="mt-6 text-sm text-fg-2">
            {results.length}
            {hasMore ? "+" : ""} kết quả cho “{q}”
          </p>
          <div className="mt-4">
            <NovelGrid novels={results} />
          </div>
          <PageNav page={page} hasMore={hasMore} hrefFor={hrefFor} />
        </>
      )}
    </main>
  );
}
