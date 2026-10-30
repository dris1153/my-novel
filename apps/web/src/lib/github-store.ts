import { getAuthorizedUser } from "./auth";

// Đọc repo `novel-data` qua GitHub Contents API. CHỈ chạy ở server: token không được ra browser.

const API = "https://api.github.com";

/** Chương/ảnh đổi rất ít; crawl mới hiện sau tối đa ngần này giây. */
export const REVALIDATE_SECONDS = 600;

export function githubConfig() {
  const repo = process.env.GITHUB_DATA_REPO;
  const token = process.env.GITHUB_DATA_TOKEN;
  if (!repo || !token) {
    throw new Error("Thiếu GITHUB_DATA_REPO hoặc GITHUB_DATA_TOKEN — xem apps/web/.env.example");
  }
  return { repo, token };
}

export const API_BASE = API;

/** Tag cache của một file — dùng để vô hiệu hoá ngay sau khi ghi. */
export function cacheTag(path: string, ref: string): string {
  return `gh:${ref}:${path}`;
}

/** `null` khi file không tồn tại; lỗi khác (kể cả rate limit) thì ném. */
async function getRaw(path: string, ref: string): Promise<Response | null> {
  // Lớp chặn thứ hai sau proxy: mọi lần đọc nội dung đều phải đi qua một phiên hợp lệ.
  if (!(await getAuthorizedUser())) throw new Error("Unauthorized");
  const { repo, token } = githubConfig();
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  const res = await fetch(`${API}/repos/${repo}/contents/${encoded}?ref=${encodeURIComponent(ref)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.raw+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: REVALIDATE_SECONDS, tags: [cacheTag(path, ref)] },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    const left = res.headers.get("x-ratelimit-remaining");
    throw new Error(`GitHub ${res.status} khi đọc ${path}${left === "0" ? " (hết rate limit)" : ""}`);
  }
  return res;
}

export async function readText(path: string, ref = "main"): Promise<string | null> {
  const res = await getRaw(path, ref);
  return res ? res.text() : null;
}

export async function readJson<T>(path: string, ref = "main"): Promise<T | null> {
  const res = await getRaw(path, ref);
  return res ? ((await res.json()) as T) : null;
}

export async function readBinary(path: string, ref = "main"): Promise<ArrayBuffer | null> {
  const res = await getRaw(path, ref);
  return res ? res.arrayBuffer() : null;
}
