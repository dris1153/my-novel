"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { CrawlJobView } from "@/lib/crawl-status";

const POLL_MS = 2000;

/**
 * Theo dõi tiến trình crawl. Chỉ mount khi server đã thấy có job chưa xong (hoặc có
 * lỗi), nên khi xong thì `router.refresh()` khiến component này unmount — không poll mãi.
 */
export function CrawlProgress({ initial }: { initial: CrawlJobView[] }) {
  const router = useRouter();
  const [jobs, setJobs] = useState(initial);

  useEffect(() => {
    let active = true;
    let wasRunning = false;

    async function tick() {
      let next: CrawlJobView[];
      try {
        const res = await fetch("/api/crawl", { cache: "no-store" });
        next = ((await res.json()) as { jobs: CrawlJobView[] }).jobs;
      } catch {
        return; // mất kết nối tạm thời thì bỏ qua nhịp này
      }
      if (!active) return;

      setJobs(next);

      const running = next.some((job) => !job.finished);
      if (wasRunning && !running) router.refresh();
      wasRunning = running;
    }

    const timer = setInterval(tick, POLL_MS);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [router]);

  if (jobs.length === 0) return null;

  return (
    <section className="mt-8 rounded-lg border border-line p-4">
      <h2 className="font-serif text-subheading text-ink">Đang lấy về</h2>

      <ul className="mt-3 flex flex-col gap-3">
        {jobs.map((job) => (
          <li key={job.url}>
            {job.novel ? (
              <Link
                href={`/truyen/${job.novel.slug}`}
                className="font-serif text-ink transition-colors hover:text-sepia-text">
                {job.novel.title}
              </Link>
            ) : (
              <span className="text-sm text-ink-2">Đang đọc trang truyện…</span>
            )}

            <p className={`text-xs ${job.error ? "text-oxblood" : "text-ink-3"}`}>
              {job.error
                ? `Lỗi: ${job.error}`
                : job.finished
                  ? `Xong · ${job.novel?.chapters ?? 0} chương`
                  : `Đang lấy… ${job.novel?.chapters ?? 0} chương`}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
