import { connection } from "next/server";

import { DoodleBook } from "@/components/doodles";
import { ContinueReading } from "@/components/novel/continue-reading";
import { NovelGridCard } from "@/components/novel/novel-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { fetchRecent } from "@/lib/queries";

export default async function HomePage() {
  // Không prerender lúc build (cần GitHub token); khác `force-dynamic` ở chỗ vẫn dùng data cache.
  await connection();
  const novels = await fetchRecent(48, 0);

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 pt-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="font-serif text-[32px] leading-[1.12] text-ink">Thư viện</h1>
          <p className="mt-2 max-w-[52ch] text-sm text-ink-3">
            Truyện đã lấy về, đọc và lưu tiến độ ở đây.
          </p>
        </div>
        <DoodleBook size={64} rotate={-8} className="hidden shrink-0 text-ink-3 md:block" />
      </div>

      <div className="mt-10 flex flex-col gap-12">
        <ContinueReading />

        <section>
          <SectionHeading title="Tất cả truyện" align="left" className="mb-6" />

          {novels.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
              {novels.map((novel, index) => (
                <NovelGridCard key={novel.slug} novel={novel} priority={index < 6} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <DoodleBook size={88} rotate={-6} wash />
      <p className="mt-8 font-serif text-[22px] text-ink">Thư viện còn trống</p>
      <p className="mt-2 max-w-[44ch] text-sm text-ink-3">
        Chạy pnpm crawl &lt;url truyenfull&gt; trên máy để thêm truyện.
      </p>
    </div>
  );
}
