"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "./auth";
import { isRunning, normalizeTruyenfullUrl, startCrawl } from "./crawl-runner";
import { createClient } from "./supabase/server";

export type AuthState = { error: string | null; message?: string };

export async function signIn(_prev: AuthState, form: FormData): Promise<AuthState> {
  const supabase = await createClient();

  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Nhập email và mật khẩu." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email hoặc mật khẩu không đúng." };

  revalidatePath("/", "layout");
  redirect("/tu-truyen");
}

export async function signUp(_prev: AuthState, form: FormData): Promise<AuthState> {
  const supabase = await createClient();

  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const displayName = String(form.get("display_name") ?? "").trim();

  if (!email || !password) return { error: "Nhập email và mật khẩu." };
  if (password.length < 6) return { error: "Mật khẩu cần ít nhất 6 ký tự." };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: displayName ? { display_name: displayName } : undefined },
  });

  if (error) return { error: error.message };

  // Bật "Confirm email" thì chưa có session — báo người dùng kiểm tra hộp thư.
  if (!data.session) {
    return { error: null, message: "Kiểm tra email để xác nhận tài khoản rồi đăng nhập." };
  }

  revalidatePath("/", "layout");
  redirect("/tu-truyen");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function updateDisplayName(_prev: AuthState, form: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Cần đăng nhập." };

  const displayName = String(form.get("display_name") ?? "").trim();
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName || null })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/toi");
  return { error: null, message: "Đã lưu." };
}

export type AddNovelState = { error: string | null; message?: string };

/**
 * Dán URL truyện → spawn crawler ở tiến trình con, trả về ngay để UI poll.
 * Crawler chạy nền nên trang không bị khoá, và tiến trình được detach nên đóng
 * browser vẫn chạy tiếp.
 */
export async function addNovelByUrl(_prev: AddNovelState, form: FormData): Promise<AddNovelState> {
  await requireUser();

  const url = normalizeTruyenfullUrl(String(form.get("url") ?? ""));
  if (!url) {
    return {
      error: "URL phải là trang truyện trên truyenfull, ví dụ https://truyenfull.live/ten-truyen/",
    };
  }

  if (isRunning(url)) {
    return { error: null, message: "Truyện này đang được lấy về rồi." };
  }

  startCrawl(url);
  revalidatePath("/");
  return { error: null, message: "Đang lấy truyện về…" };
}
