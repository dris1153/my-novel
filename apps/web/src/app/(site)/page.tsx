import { AddNovelForm } from "@/components/novel/add-novel-form";
import { ContinueReading } from "@/components/novel/continue-reading";
import { CrawlProgress } from "@/components/novel/crawl-progress";
import { NovelGridCard } from "@/components/novel/novel-card";
import { DoodleBook } from "@/components/doodles";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCrawlJobViews } from "@/lib/crawl-status";
import { fetchRecent } from "@/lib/queries";

/** Trang chủ phải phản ánh job crawl đang chạy nên render động, không ISR. */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [novels, crawlJobs] = await Promise.all([fetchRecent(48, 0), getCrawlJobViews()]);
  const activeJobs = crawlJobs.filter((job) => !job.finished || job.error);

  return (
    <main className="mx-auto w-full max-w-[1200px] px-6 pt-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="font-serif text-[32px] leading-[1.12] text-ink">Thư viện</h1>
          <p className="mt-2 max-w-[52ch] text-sm text-ink-3">
            Dán link truyện để lấy về, rồi đọc và lưu tiến độ ở đây.
          </p>
        </div>
        <DoodleBook size={64} rotate={-8} className="hidden shrink-0 text-ink-3 md:block" />
      </div>

      <AddNovelForm />

      {activeJobs.length > 0 && <CrawlProgress initial={activeJobs} />}

      <div className="mt-10 flex flex-col gap-12">
        <ContinueReading />

        <section>
          <SectionHeading title="Tất cả truyện" align="left" className="mb-6" />

          {novels.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
              {novels.map((novel, index) => (
                <NovelGridCard key={novel.id} novel={novel} priority={index < 6} />
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
        Dán link truyện trên truyenfull vào ô phía trên để lấy về máy.
      </p>
    </div>
  );
}
