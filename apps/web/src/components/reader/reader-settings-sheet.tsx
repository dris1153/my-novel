"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";
import {
  READER_LINE_HEIGHTS,
  READER_SIZES,
  READER_THEMES,
  setReaderPrefs,
  useReaderPrefs,
  type ReaderLineHeight,
  type ReaderThemeKey,
} from "@/lib/reader";

/**
 * Bảng cài đặt đọc dạng bottom sheet. Màu theo nền đọc đang chọn để xem trước ngay trên trang.
 * Ghi thẳng vào store prefs; đóng bằng nền mờ hoặc Esc, trả focus về nút "Aa".
 */
export function ReaderSettingsSheet({ onClose }: { onClose: () => void }) {
  const prefs = useReaderPrefs();
  const theme = READER_THEMES[prefs.theme];
  const sheetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    sheetRef.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const segment = (selected: boolean) =>
    cn("min-h-11 flex-1 rounded-lg text-sm transition-colors", selected && "font-semibold");
  const segmentStyle = (selected: boolean) =>
    selected ? { backgroundColor: theme.fg, color: theme.bg } : { color: theme.dim };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Cài đặt đọc">
      <button type="button" aria-label="Đóng cài đặt" onClick={onClose} className="absolute inset-0 cursor-default bg-black/45" />

      <div
        ref={sheetRef}
        tabIndex={-1}
        className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[85dvh] w-full max-w-[560px] flex-col gap-5 overflow-y-auto rounded-t-sheet border-t px-5 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] outline-none"
        style={{ backgroundColor: theme.bg, color: theme.fg, borderColor: `${theme.dim}55` }}>
        <span aria-hidden className="mx-auto h-1 w-9 rounded-full" style={{ backgroundColor: `${theme.dim}88` }} />

        <Group title="Nền">
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(READER_THEMES) as ReaderThemeKey[]).map((key) => {
              const t = READER_THEMES[key];
              const selected = prefs.theme === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setReaderPrefs({ theme: key })}
                  className="flex flex-col items-center gap-1.5 text-xs">
                  <span
                    className="grid size-11 place-items-center rounded-full border-2 font-read text-[15px]"
                    style={{ backgroundColor: t.bg, color: t.fg, borderColor: selected ? theme.fg : `${theme.dim}66` }}>
                    Aa
                  </span>
                  <span style={{ color: selected ? theme.fg : theme.dim }}>{t.label}</span>
                </button>
              );
            })}
          </div>
        </Group>

        <Group title="Cỡ chữ">
          <div className="flex items-center gap-3">
            <SizeStep label="Giảm cỡ chữ" disabled={prefs.sizeIndex === 0} onClick={() => setReaderPrefs({ sizeIndex: prefs.sizeIndex - 1 })} theme={theme} small />
            <div className="flex flex-1 justify-center gap-2" aria-hidden>
              {READER_SIZES.map((size, index) => (
                <span
                  key={size}
                  className="size-2 rounded-full"
                  style={{ backgroundColor: index <= prefs.sizeIndex ? theme.fg : `${theme.dim}55` }}
                />
              ))}
            </div>
            <SizeStep
              label="Tăng cỡ chữ"
              disabled={prefs.sizeIndex === READER_SIZES.length - 1}
              onClick={() => setReaderPrefs({ sizeIndex: prefs.sizeIndex + 1 })}
              theme={theme}
            />
          </div>
        </Group>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Group title="Kiểu chữ">
            <div className="flex gap-1 rounded-xl p-1" style={{ backgroundColor: `${theme.dim}22` }}>
              {[
                { serif: true, label: "Có chân", font: "font-read" },
                { serif: false, label: "Không chân", font: "font-sans" },
              ].map(({ serif, label, font }) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={prefs.serif === serif}
                  onClick={() => setReaderPrefs({ serif })}
                  className={cn(segment(prefs.serif === serif), font)}
                  style={segmentStyle(prefs.serif === serif)}>
                  {label}
                </button>
              ))}
            </div>
          </Group>

          <Group title="Giãn dòng">
            <div className="flex gap-1 rounded-xl p-1" style={{ backgroundColor: `${theme.dim}22` }}>
              {(Object.keys(READER_LINE_HEIGHTS) as ReaderLineHeight[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={prefs.lineHeight === key}
                  onClick={() => setReaderPrefs({ lineHeight: key })}
                  className={segment(prefs.lineHeight === key)}
                  style={segmentStyle(prefs.lineHeight === key)}>
                  {READER_LINE_HEIGHTS[key].label}
                </button>
              ))}
            </div>
          </Group>
        </div>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-[13px] font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function SizeStep({
  label,
  disabled,
  onClick,
  theme,
  small = false,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  theme: (typeof READER_THEMES)[ReaderThemeKey];
  small?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn("grid size-11 place-items-center rounded-xl border font-read disabled:opacity-40", small ? "text-sm" : "text-xl")}
      style={{ borderColor: `${theme.dim}66`, color: theme.fg }}>
      A
    </button>
  );
}
