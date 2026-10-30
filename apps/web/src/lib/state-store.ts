import { revalidateTag } from "next/cache";
import { EMPTY_STATE, STATE_BRANCH, statePath, type UserState } from "shared/src/store.ts";

import { getAuthorizedUser } from "./auth";
import { API_BASE, cacheTag, githubConfig, readJson } from "./github-store";

// State người dùng = 1 file JSON trên branch `state`. Mỗi lần ghi là 1 commit, nên caller
// phải tự throttle (xem use-progress-sync.ts).

const MAX_ATTEMPTS = 5;

async function currentUserId(): Promise<string> {
  const user = await getAuthorizedUser();
  if (!user) throw new Error("Unauthorized");
  return user.id;
}

/** State của người đang đăng nhập; chưa có file → rỗng. */
export async function readMyState(): Promise<UserState> {
  const userId = await currentUserId();
  return (await readJson<UserState>(statePath(userId), STATE_BRANCH)) ?? EMPTY_STATE;
}

/** Cho trang đọc: lỗi đọc state (GitHub 5xx, rate limit) không được chặn việc đọc truyện. */
export async function readMyStateOrEmpty(): Promise<UserState> {
  try {
    return await readMyState();
  } catch (e) {
    console.error("readMyState thất bại, dùng state rỗng:", e);
    return EMPTY_STATE;
  }
}

function contentsUrl(path: string): string {
  const { repo } = githubConfig();
  return `${API_BASE}/repos/${repo}/contents/${path}`;
}

function headers(): HeadersInit {
  return {
    Authorization: `Bearer ${githubConfig().token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function fetchCurrent(path: string): Promise<{ state: UserState; sha: string } | null> {
  const res = await fetch(`${contentsUrl(path)}?ref=${STATE_BRANCH}`, { headers: headers(), cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub ${res.status} khi đọc ${path}`);
  const body = (await res.json()) as { content: string; sha: string };
  const json = Buffer.from(body.content, "base64").toString("utf8");
  return { state: JSON.parse(json) as UserState, sha: body.sha };
}

/**
 * Đọc → áp `apply` → ghi lại. `apply` phải thuần và trả về chính state cũ nếu không đổi (bỏ qua commit).
 * Sha lệch (409/422) nghĩa là có ghi khác chen vào: đọc lại và áp lại, nên không mất thay đổi nào.
 */
export async function mutateMyState(apply: (state: UserState) => UserState): Promise<UserState> {
  const path = statePath(await currentUserId());

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const current = await fetchCurrent(path);
    const base = current?.state ?? EMPTY_STATE;
    const next = apply(base);
    if (next === base) return base;

    const res = await fetch(contentsUrl(path), {
      method: "PUT",
      headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `state: ${path.slice(6, 14)}`,
        content: Buffer.from(JSON.stringify(next, null, 2) + "\n").toString("base64"),
        branch: STATE_BRANCH,
        ...(current ? { sha: current.sha } : {}),
      }),
      cache: "no-store",
    });

    if (res.ok) {
      revalidateTag(cacheTag(path, STATE_BRANCH), { expire: 0 });
      return next;
    }
    if (res.status !== 409 && res.status !== 422) {
      throw new Error(`GitHub ${res.status} khi ghi ${path}`);
    }
    // Lệch nhịp ngẫu nhiên để các lần ghi đồng thời không đụng nhau mãi.
    await new Promise((r) => setTimeout(r, 50 + Math.random() * 150));
  }
  throw new Error("Không ghi được state sau nhiều lần thử (xung đột liên tục)");
}
