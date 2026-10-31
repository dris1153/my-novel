"use client";

import { useState } from "react";

/** Mô tả quá dài thì gập còn 4 dòng; đoạn ngắn hiện nguyên, không cần nút. */
const LONG = 220;

export function DescriptionAccordion({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > LONG;

  return (
    <div>
      <p
        className={`text-[15px] leading-relaxed whitespace-pre-line text-fg-2 ${long && !open ? "line-clamp-4" : ""}`}>
        {text}
      </p>
      {long && (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="mt-1 min-h-11 text-sm font-semibold text-accent-fg">
          {open ? "Thu gọn" : "Xem thêm"}
        </button>
      )}
    </div>
  );
}
