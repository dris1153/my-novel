"use server";

import { isSlug } from "shared/src/store.ts";

import { signIn, signOut } from "@/auth";
import { requireUser } from "@/lib/auth";
import { fetchNovelCards } from "@/lib/queries";
import { markSeen, setSaved } from "@/lib/state-ops";
import { mutateMyState } from "@/lib/state-store";

export async function signInWithGoogle(formData: FormData) {
  const from = String(formData.get("from") ?? "");
  // Chỉ nhận đường dẫn nội bộ ("//host" và "/\host" là open redirect).
  const redirectTo = /^\/(?![\/\\])/.test(from) ? from : "/";
  await signIn("google", { redirectTo });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/dang-nhap" });
}

/** Theo dõi / bỏ theo dõi. Đặt giá trị tường minh (không phải toggle) để retry an toàn. */
export async function setNovelSaved(slug: string, saved: boolean) {
  await requireUser();
  if (!isSlug(slug)) throw new Error("slug không hợp lệ");
  const now = new Date().toISOString();
  // Bắt đầu theo dõi = mốc tính "+N chương mới" từ đây trở đi.
  const [novel] = saved ? await fetchNovelCards([slug]).catch(() => []) : [];
  await mutateMyState((state) => {
    const next = setSaved(state, slug, saved, now);
    return novel ? markSeen(next, slug, novel.chapterCount) : next;
  });
}
