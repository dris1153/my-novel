"use client";

import { useActionState, useState } from "react";
import { splitChapters } from "shared";

import { importChapters, type ActionState } from "@/lib/actions";

const INITIAL: ActionState = { error: null };

export function ChapterImport({ novelId }: { novelId: string }) {
  const [state, action, pending] = useActionState(importChapters, INITIAL);
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  // Xem trước ngay ở client để không phải round-trip mới biết regex có khớp không.
  const preview = splitChapters(content);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setContent(await file.text());
    e.target.value = "";
  }

  return (
    <form action={action} className="rounded-xl border border-line bg-surface p-5">
      <input type="hidden" name="novel_id" value={novelId} />
      <input type="hidden" name="content" value={content} />

      <h2 className="text-[15px] font-bold">Import chương hàng loạt</h2>
      <p className="mt-1 mb-4 text-sm text-ink-2">
        Dán nội dung hoặc chọn file .txt. Mỗi chương bắt đầu bằng một dòng dạng{" "}
        <code className="rounded bg-raised px-1.5 py-0.5 text-xs">Chương 12: Tên chương</code>.
        Chương trùng số sẽ được ghi đè.
      </p>

      <label className="mb-3 inline-block rounded-lg border border-line bg-raised px-3 py-2 text-xs font-semibold">
        Chọn file .txt
        <input type="file" accept=".txt,text/plain" onChange={onFile} className="hidden" />
      </label>
      {fileName && <span className="ml-2 text-xs text-ink-3">{fileName}</span>}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={8}
        placeholder="Chương 1: Khởi đầu&#10;Nội dung chương…"
        className="mb-3 w-full resize-y rounded-lg border border-line bg-paper px-3 py-2.5 font-mono text-xs outline-none focus:border-sienna"
      />

      {content.trim() !== "" && (
        <div className="mb-3 rounded-lg bg-raised p-3 text-sm">
          {preview.length === 0 ? (
            <span className="text-sienna">
              Không tìm thấy chương nào — kiểm tra lại định dạng dòng tiêu đề.
            </span>
          ) : (
            <>
              <span className="font-semibold">Tách được {preview.length} chương</span>
              <span className="text-ink-3">
                {" "}
                · từ {Math.min(...preview.map((c) => c.number))} đến{" "}
                {Math.max(...preview.map((c) => c.number))}
              </span>
              <ul className="mt-2 space-y-0.5 text-xs text-ink-2">
                {preview.slice(0, 3).map((c, i) => (
                  <li key={i}>
                    Chương {c.number} — {c.title}
                  </li>
                ))}
                {preview.length > 3 && <li className="text-ink-3">…và {preview.length - 3} chương nữa</li>}
              </ul>
            </>
          )}
        </div>
      )}

      {state.error && <p className="mb-3 text-sm text-sienna">{state.error}</p>}
      {state.saved && !pending && <p className="mb-3 text-sm text-ok">Đã import xong.</p>}

      <button
        type="submit"
        disabled={pending || preview.length === 0}
        className="rounded-lg bg-sienna px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {pending ? "Đang import…" : `Import ${preview.length || ""} chương`}
      </button>
    </form>
  );
}
