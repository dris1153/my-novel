import { SearchForm } from "@/components/chrome/search-form";
import { GenreChips } from "@/components/novel/genre-chips";
import { NovelGrid } from "@/components/novel/novel-card";
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
    <main className="mx-auto w-full max-w-[1200px] px-4 pt-4 lg:px-6 lg:pt-6">
      <h1 className="sr-only">Tìm kiếm</h1>

      <SearchForm defaultValue={q} autoFocus withButton />

      {q === "" ? (
        <section className="mt-4 rounded-card bg-surface p-4">
          <h2 className="mb-3 border-l-4 border-accent pl-2.5 font-heading text-lg font-bold text-fg">Duyệt theo thể loại</h2>
          <GenreChips genres={tiles.filter((tile) => tile.count > 0)} />
        </section>
      ) : results.length === 0 ? (
        <EmptyState
          art="no-results"
          title="Không tìm thấy truyện"
          description={`Không có truyện nào khớp “${q}”. Thử tên ngắn hơn hoặc tên tác giả.`}
        />
      ) : (
        <div className="mt-4 rounded-card bg-surface p-3 lg:p-5">
          <p className="mb-4 text-sm text-fg-2">
            {results.length}
            {hasMore ? "+" : ""} kết quả cho “{q}”
          </p>
          <NovelGrid novels={results} />
          <PageNav page={page} hasMore={hasMore} hrefFor={hrefFor} />
        </div>
      )}
    </main>
  );
}
