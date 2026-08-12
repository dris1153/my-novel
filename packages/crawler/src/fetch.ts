const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

/** Cloudflare chuyển sang JS challenge — fetch không vượt được, phải dừng và resume. */
export class ChallengeError extends Error {
  constructor() {
    super('Cloudflare bật challenge — không fetch được nữa. Chạy lại lệnh để resume.');
    this.name = 'ChallengeError';
  }
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Trang challenge THẬT có title "Just a moment". KHÔNG match cf-turnstile —
 * widget đó nhúng sẵn trong trang hợp lệ (form comment), match là false-positive
 * làm crawler chết trên mọi trang.
 */
export function isChallengePage(html: string): boolean {
  return /<title>\s*(Just a moment|Attention Required|Access denied)/i.test(html);
}

/**
 * Fetch HTML với UA trình duyệt (truyenfull 403 nếu thiếu UA).
 * Retry backoff cho 429/5xx. 403 hoặc trang challenge → ChallengeError (không retry vô ích).
 */
export async function fetchHtml(url: string, retries = 3): Promise<string> {
  for (let attempt = 0; ; attempt++) {
    let res: Response;
    try {
      res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'vi,en;q=0.8' } });
    } catch (e) {
      if (attempt >= retries) throw e;
      await sleep(2 ** attempt * 1000);
      continue;
    }

    if (res.status === 403) throw new ChallengeError();

    if (res.status === 429 || res.status >= 500) {
      if (attempt >= retries) throw new Error(`HTTP ${res.status} sau ${retries} lần thử: ${url}`);
      await sleep(2 ** attempt * 1000);
      continue;
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);

    const html = await res.text();
    if (isChallengePage(html)) throw new ChallengeError();
    return html;
  }
}

/** Tải ảnh bìa về Buffer. Trả null nếu lỗi — cover không được chặn cả job. */
export async function fetchImage(url: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    return { buffer: Buffer.from(await res.arrayBuffer()), contentType };
  } catch {
    return null;
  }
}
