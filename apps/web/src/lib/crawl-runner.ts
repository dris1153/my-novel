import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";

export type CrawlJob = {
  url: string;
  novelId: string | null;
  startedAt: number;
  finished: boolean;
  finishedAt: number | null;
  error: string | null;
};

const FINISHED_TTL_MS = 60_000;

/**
 * Registry trong bộ nhớ của Next server.
 *
 * Cố tình KHÔNG lưu vào DB: tiến độ suy ra được từ số chương đã có trong DB, còn
 * trạng thái "đang chạy" thì chỉ có ý nghĩa khi server còn sống. Server restart thì
 * mất trạng thái này, nhưng crawler resume-safe nên bấm lại là chạy tiếp.
 */
const JOBS = new Map<string, CrawlJob>();

/** process.cwd() là `apps/web` khi chạy `pnpm web`. */
function repoRoot() {
  return path.resolve(process.cwd(), "../..");
}

/**
 * Chuẩn hoá URL truyện. Chấp nhận thiếu scheme; từ chối domain khác truyenfull.
 * Trả null nếu không hợp lệ.
 */
export function normalizeTruyenfullUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {
    return null;
  }

  if (!/^truyenfull\.[a-z]+$/i.test(parsed.hostname)) return null;

  return parsed.toString();
}

/** Job đã xong được giữ lại 60s để UI kịp hiện lỗi, sau đó dọn khỏi bộ nhớ. */
function prune() {
  const cutoff = Date.now() - FINISHED_TTL_MS;
  for (const [url, job] of JOBS) {
    if (job.finished && job.finishedAt !== null && job.finishedAt < cutoff) JOBS.delete(url);
  }
}

export function getJobs(): CrawlJob[] {
  prune();
  return [...JOBS.values()].sort((a, b) => b.startedAt - a.startedAt);
}

export function isRunning(url: string): boolean {
  const job = JOBS.get(url);
  return Boolean(job && !job.finished);
}

export function startCrawl(url: string): CrawlJob {
  const existing = JOBS.get(url);
  if (existing && !existing.finished) return existing;

  const job: CrawlJob = {
    url,
    novelId: null,
    startedAt: Date.now(),
    finished: false,
    finishedAt: null,
    error: null,
  };
  JOBS.set(url, job);

  const root = repoRoot();
  const child = spawn(
    path.join(root, "packages/crawler/node_modules/.bin/tsx"),
    [path.join(root, "packages/crawler/src/cli.ts"), url],
    {
      cwd: root,
      // Tách khỏi tiến trình cha: đóng browser hay restart server thì crawl vẫn chạy tiếp.
      detached: true,
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    }
  );

  watchChild(child, job);
  child.unref();

  return job;
}

function watchChild(child: ChildProcess, job: CrawlJob) {
  let stdout = "";
  let stderrTail = "";

  child.stdout?.on("data", (chunk: Buffer) => {
    stdout += chunk.toString();
    // CLI in "  novel id=<uuid> (đã đăng)" ngay sau khi tạo truyện — đủ để gắn job
    // với truyện mà không cần bảng job trong DB.
    const match = stdout.match(/novel id=([0-9a-fA-F-]{36})/);
    if (match && !job.novelId) job.novelId = match[1];
  });

  child.stderr?.on("data", (chunk: Buffer) => {
    stderrTail = chunk.toString().trim().split("\n").slice(-3).join(" ").trim();
  });

  child.on("error", (e) => {
    job.finished = true;
    job.finishedAt = Date.now();
    job.error = `Không chạy được crawler: ${e.message}`;
  });

  child.on("exit", (code) => {
    job.finished = true;
    job.finishedAt = Date.now();
    if (code !== 0 && !job.error) {
      // CLI in "✖ <lý do>" ra stderr trước khi thoát.
      job.error = stderrTail.replace(/^✖\s*/, "") || `Crawler thoát với mã ${code}`;
    }
  });
}
