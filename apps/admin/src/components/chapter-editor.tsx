"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { countWords } from "shared";

import { saveChapter, type ActionState } from "@/lib/actions";

type Props = {
  novelId: string;
  /** Có = sửa; không = tạo mới. */
  chapter?: { id: string; number: number; title: string; content: string };
  /** Số gợi ý khi tạo mới (max + 1). */
  suggestedNumber?: number;
};

const INITIAL: ActionState = { error: null };

export function ChapterEditor({ novelId, chapter, suggestedNumber }: Props) {
  const editing = Boolean(chapter);
  const [state, action, pending] = useActionState(saveChapter, INITIAL);
  const [content, setContent] = useState(chapter?.content ?? "");

  return (
    <form action={action} className="mx-auto max-w-3xl">
      <input type="hidden" name="novel_id" value={novelId} />
      {chapter && <input type="hidden" name="id" value={chapter.id} />}

      <Link href={`/novels/${novelId}?tab=chuong`} className="text-sm text-ink-2 hover:text-sienna">
        ‹ Danh sách chương
      </Link>
      <h1 className="mt-1 mb-5 font-serif text-2xl tracking-tight">
        {editing ? `Sửa chương ${chapter!.number}` : "Thêm chương mới"}
      </h1>

      <div className="mb-4 grid gap-4 sm:grid-cols-[120px_1fr]">
        <div>
          <label className="mb-1.5 block text-sm text-ink-2">Số chương *</label>
          <input
            name="number"
            type="number"
            min={1}
            required
            defaultValue={chapter?.number ?? suggestedNumber ?? 1}
            className="w-full rounded-lg border border-ash bg-surface px-3 py-2.5 text-sm outline-none focus:border-sienna"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-2">Tiêu đề *</label>
          <input
            name="title"
            required
            defaultValue={chapter?.title ?? ""}
            placeholder="Tên chương"
            className="w-full rounded-lg border border-ash bg-surface px-3 py-2.5 text-sm outline-none focus:border-sienna"
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-1.5 flex items-baseline justify-between">
          <label className="text-sm text-ink-2">Nội dung *</label>
          <span className="text-xs text-ink-3">{countWords(content)} từ</span>
        </div>
        <textarea
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={22}
          placeholder="Nội dung chương…"
          // Serif + leading 1.8: soát chính tả tiếng Việt sát với vùng đọc.
          className="w-full resize-y rounded-lg border border-line bg-surface px-4 py-3 font-(family-name:--font-source-serif) text-[15px] leading-[1.8] outline-none focus:border-sienna"
        />
      </div>

      {state.error && <p className="mb-3 text-sm text-sienna">{state.error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-sienna px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Đang lưu…" : "Lưu chương"}
        </button>
        <Link
          href={`/novels/${novelId}?tab=chuong`}
          className="text-sm font-medium text-ink-2 hover:text-sienna"
        >
          Huỷ
        </Link>
      </div>
    </form>
  );
}
