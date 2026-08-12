"use client";

import { useActionState, useState } from "react";
import { slugify, type Genre, type Novel } from "shared";

import { CoverUpload } from "./cover-upload";

import { createNovel, updateNovel, type ActionState } from "@/lib/actions";

type Props = {
  genres: Genre[];
  novel?: Novel;
  selectedGenreIds?: number[];
};

const INITIAL: ActionState = { error: null };

export function NovelForm({ genres, novel, selectedGenreIds = [] }: Props) {
  const editing = Boolean(novel);
  const [state, action, pending] = useActionState(editing ? updateNovel : createNovel, INITIAL);

  const [title, setTitle] = useState(novel?.title ?? "");
  const [slug, setSlug] = useState(novel?.slug ?? "");

  // Slug tự sinh từ tên cho tới khi người dùng tự sửa; sửa rồi thì tôn trọng.
  const [slugTouched, setSlugTouched] = useState(editing);
  const effectiveSlug = slugTouched ? slug : slugify(title);

  return (
    <form action={action} className="grid gap-7 lg:grid-cols-[1fr_280px]">
      {novel && <input type="hidden" name="id" value={novel.id} />}

      <div>
        <Field label="Tên truyện *">
          <input
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Slug (URL)">
            <input
              name="slug"
              value={effectiveSlug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              className={inputCls}
            />
          </Field>
          <Field label="Tác giả *">
            <input name="author" required defaultValue={novel?.author ?? ""} className={inputCls} />
          </Field>
        </div>

        <Field label="Mô tả">
          <textarea
            name="description"
            rows={4}
            defaultValue={novel?.description ?? ""}
            className={`${inputCls} resize-y`}
          />
        </Field>

        <Field label="Thể loại">
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <label
                key={g.id}
                className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold has-checked:border-transparent has-checked:bg-sienna has-checked:text-white"
              >
                <input
                  type="checkbox"
                  name="genres"
                  value={g.id}
                  defaultChecked={selectedGenreIds.includes(g.id)}
                  className="sr-only"
                />
                {g.name}
              </label>
            ))}
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Trạng thái">
            <select name="status" defaultValue={novel?.status ?? "ongoing"} className={inputCls}>
              <option value="ongoing">Đang ra</option>
              <option value="completed">Hoàn thành</option>
              <option value="hiatus">Tạm ngưng</option>
            </select>
          </Field>
          <Field label="Hiển thị">
            <label className="flex items-center gap-2 py-2.5 text-sm">
              <input
                type="checkbox"
                name="published"
                defaultChecked={novel?.published ?? false}
                className="size-4 accent-sienna"
              />
              Đăng công khai
            </label>
          </Field>
        </div>
      </div>

      <div>
        <CoverUpload slug={effectiveSlug} initialUrl={novel?.cover_url} />

        {state.error && <p className="mt-4 text-sm text-sienna">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-5 w-full rounded-lg bg-sienna py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Đang lưu…" : editing ? "Lưu thay đổi" : "Tạo truyện"}
        </button>

        {state.saved && !pending && <p className="mt-2 text-center text-xs text-ok">Đã lưu</p>}
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-sienna";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <span className="mb-1.5 block text-xs font-semibold text-ink-2">{label}</span>
      {children}
    </div>
  );
}
