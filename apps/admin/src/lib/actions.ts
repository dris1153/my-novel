"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { countWords, slugify, splitChapters } from "shared";

import { requireAdmin } from "./auth";

export type ActionState = { error: string | null; saved?: boolean };

function readNovelForm(form: FormData) {
  const title = String(form.get("title") ?? "").trim();
  const author = String(form.get("author") ?? "").trim();
  const slugRaw = String(form.get("slug") ?? "").trim();
  const status = String(form.get("status") ?? "ongoing");

  if (!title) return { error: "Tên truyện không được để trống" as const };
  if (!author) return { error: "Tác giả không được để trống" as const };
  if (!["ongoing", "completed", "hiatus"].includes(status)) {
    return { error: "Trạng thái không hợp lệ" as const };
  }

  return {
    error: null,
    values: {
      title,
      author,
      slug: slugify(slugRaw || title),
      status: status as "ongoing" | "completed" | "hiatus",
      description: String(form.get("description") ?? "").trim() || null,
      cover_url: String(form.get("cover_url") ?? "").trim() || null,
      published: form.get("published") === "on",
    },
  };
}

export async function createNovel(_prev: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  const parsed = readNovelForm(form);
  if (parsed.error) return { error: parsed.error };

  const { data, error } = await supabase
    .from("novels")
    .insert(parsed.values)
    .select("id")
    .single();

  if (error) {
    return {
      error: error.code === "23505" ? `Slug "${parsed.values.slug}" đã tồn tại` : error.message,
    };
  }

  const genreIds = form.getAll("genres").map(Number).filter(Number.isInteger);
  if (genreIds.length) {
    await supabase
      .from("novel_genres")
      .insert(genreIds.map((genre_id) => ({ novel_id: data.id, genre_id })));
  }

  revalidatePath("/");
  redirect(`/novels/${data.id}`);
}

export async function updateNovel(_prev: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  const id = String(form.get("id") ?? "");
  if (!id) return { error: "Thiếu id truyện" };

  const parsed = readNovelForm(form);
  if (parsed.error) return { error: parsed.error };

  const { error } = await supabase.from("novels").update(parsed.values).eq("id", id);
  if (error) {
    return {
      error: error.code === "23505" ? `Slug "${parsed.values.slug}" đã tồn tại` : error.message,
    };
  }

  const genreIds = form.getAll("genres").map(Number).filter(Number.isInteger);
  await supabase.from("novel_genres").delete().eq("novel_id", id);
  if (genreIds.length) {
    await supabase
      .from("novel_genres")
      .insert(genreIds.map((genre_id) => ({ novel_id: id, genre_id })));
  }

  revalidatePath("/");
  revalidatePath(`/novels/${id}`);
  return { error: null, saved: true };
}

export async function deleteNovel(form: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const id = String(form.get("id") ?? "");
  if (!id) return;

  await supabase.from("novels").delete().eq("id", id);
  revalidatePath("/");
  redirect("/");
}

/**
 * Import hàng loạt từ .txt. Chương trùng số sẽ ghi đè bản cũ (upsert) để
 * import lại file đã sửa không bị lỗi unique constraint.
 */
export async function importChapters(_prev: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  const novelId = String(form.get("novel_id") ?? "");
  const raw = String(form.get("content") ?? "");
  if (!novelId) return { error: "Thiếu id truyện" };
  if (!raw.trim()) return { error: "Chưa có nội dung để import" };

  const parsed = splitChapters(raw);
  if (parsed.length === 0) {
    return { error: 'Không tìm thấy chương nào. Mỗi chương phải bắt đầu bằng dòng "Chương <số>".' };
  }

  const duplicates = parsed.filter((c, i) => parsed.findIndex((o) => o.number === c.number) !== i);
  if (duplicates.length) {
    return { error: `Số chương bị lặp trong file: ${[...new Set(duplicates.map((d) => d.number))].join(", ")}` };
  }

  const { error } = await supabase.from("chapters").upsert(
    parsed.map((c) => ({
      novel_id: novelId,
      number: c.number,
      title: c.title,
      content: c.content,
      word_count: countWords(c.content),
    })),
    { onConflict: "novel_id,number" }
  );

  if (error) return { error: error.message };

  revalidatePath(`/novels/${novelId}`);
  return { error: null, saved: true };
}

/**
 * Tạo hoặc sửa 1 chương. Có `id` → update theo id (cho phép đổi số chương);
 * không có → insert. Đổi số trùng chương khác → lỗi rõ (23505), không văng thô.
 */
export async function saveChapter(_prev: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  const id = String(form.get("id") ?? "").trim();
  const novelId = String(form.get("novel_id") ?? "").trim();
  const number = Number(form.get("number"));
  const title = String(form.get("title") ?? "").trim();
  const content = String(form.get("content") ?? "").trim();

  if (!novelId) return { error: "Thiếu id truyện" };
  if (!Number.isInteger(number) || number <= 0) return { error: "Số chương phải là số nguyên dương" };
  if (!title) return { error: "Tiêu đề chương không được để trống" };
  if (!content) return { error: "Nội dung chương không được để trống" };

  const row = {
    novel_id: novelId,
    number,
    title,
    content,
    word_count: countWords(content),
    published: true,
  };

  const { error } = id
    ? await supabase.from("chapters").update(row).eq("id", id)
    : await supabase.from("chapters").insert(row);

  if (error) {
    return { error: error.code === "23505" ? `Chương số ${number} đã tồn tại` : error.message };
  }

  revalidatePath(`/novels/${novelId}`);
  redirect(`/novels/${novelId}?tab=chuong`);
}

export async function deleteChapter(form: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const id = String(form.get("id") ?? "");
  const novelId = String(form.get("novel_id") ?? "");
  if (!id) return;

  await supabase.from("chapters").delete().eq("id", id);
  revalidatePath(`/novels/${novelId}`);
}

export async function signOut(): Promise<void> {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
  redirect("/login");
}
