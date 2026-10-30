import { createHash } from "node:crypto";

/** Fail-closed: biến rỗng/thiếu → không ai được vào. */
export function isAllowedEmail(email: string | null | undefined, raw = process.env.ALLOWED_EMAILS): boolean {
  if (!email || !raw) return false;
  const allowed = raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(email.trim().toLowerCase());
}

/** Tên file state của người dùng — khớp `statePath()` (hex 32 ký tự). */
export function userIdFromEmail(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 32);
}
