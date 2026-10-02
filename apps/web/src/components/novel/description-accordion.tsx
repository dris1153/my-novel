"use client";

import { useState } from "react";

/**
 * Mô tả truyện — accordion CSS nguyên từ skill transitions-dev (21-accordion):
 * panel giãn bằng `grid-template-rows: 0fr ↔ 1fr`, chevron lật `scaleY`.
 * Mặc định mở để phần mô tả vẫn nằm trong HTML đầu tiên (SEO).
 */
export function DescriptionAccordion({ text }: { text: string }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="t-acc mt-8" data-open={open}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="t-acc-head flex w-full items-center justify-between gap-3 text-left">
        <span className="text-sm text-ink-2">Mô tả truyện</span>
        <span className="t-acc-chevron text-ink-3">
          <svg
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden>
            <path d="M4 6.5L8 10.5L12 6.5" />
          </svg>
        </span>
      </button>

      <div className="t-acc-panel">
        <div className="t-acc-panel-inner">
          <p className="pt-3 text-[15px] leading-relaxed whitespace-pre-line text-ink-2">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
