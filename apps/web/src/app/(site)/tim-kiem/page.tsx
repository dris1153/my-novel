import { DoodleCompass } from "@/components/doodles";
import { NovelGridCard } from "@/components/novel/novel-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageNav } from "@/components/ui/page-nav";
import { searchNovels } from "@/lib/queries";

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

  const rows = q ? await searchNovels(q, PAGE_SIZE + 1, (page - 1) * PAGE_SIZE) : [];
  const hasMore = rows.length > PAGE_SIZE;
  const results = rows.slice(0, PAGE_SIZE);

  const hrefFor = (target: number) =>
    `/tim-kiem?q=${encodeURIComponent(q)}${target > 1 ? `&page=${target}` : ""}`;

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 pt-12">
      <h1 className="font-serif text-[32px] leading-[1.12] text-ink">Tìm kiếm</h1>

      <form action="/tim-kiem" method="get" className="mt-6 flex max-w-[560px] gap-3">
        <Input
          name="q"
          defaultValue={q}
          placeholder="Tìm truyện, tác giả…"
          aria-label="Từ khoá tìm kiếm"
          autoFocus
        />
        <Button type="submit">Tìm</Button>
      </form>

      {q === "" ? (
        <p className="mt-10 text-sm text-ink-3">Nhập tên truyện hoặc tác giả để bắt đầu.</p>
      ) : results.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <DoodleCompass size={72} rotate={-8} className="text-ink-3" />
          <p className="mt-6 text-sm text-ink-2">Không tìm thấy truyện nào khớp “{q}”.</p>
        </div>
      ) : (
        <>
          <p className="mt-8 text-sm text-ink-3">
            {results.length} kết quả cho “{q}”
          </p>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {results.map((novel) => (
              <NovelGridCard key={novel.id} novel={novel} />
            ))}
          </div>
          <PageNav page={page} hasMore={hasMore} hrefFor={hrefFor} />
        </>
      )}
    </main>
  );
}
