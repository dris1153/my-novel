import { getJobs } from "./crawl-runner";
import { fetchNovelSummaries } from "./queries";

export type CrawlJobView = {
  url: string;
  finished: boolean;
  error: string | null;
  novel: { slug: string; title: string; coverUrl: string | null; chapters: number } | null;
};

/** Job crawl + thông tin truyện tương ứng (nếu crawler đã tạo xong bản ghi). */
export async function getCrawlJobViews(): Promise<CrawlJobView[]> {
  const jobs = getJobs();
  const ids = jobs.map((job) => job.novelId).filter((id): id is string => Boolean(id));
  const summaries = await fetchNovelSummaries(ids);
  const byId = new Map(summaries.map((novel) => [novel.id, novel]));

  return jobs.map((job) => {
    const novel = job.novelId ? byId.get(job.novelId) : undefined;
    return {
      url: job.url,
      finished: job.finished,
      error: job.error,
      novel: novel
        ? {
            slug: novel.slug,
            title: novel.title,
            coverUrl: novel.cover_url,
            chapters: novel.chapters?.[0]?.count ?? 0,
          }
        : null,
    };
  });
}
