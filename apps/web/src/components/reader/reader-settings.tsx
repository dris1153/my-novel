"use client";

import {
  READER_SIZES,
  READER_THEMES,
  setReaderPrefs,
  type ReaderThemeKey,
} from "@/lib/reader";

const LABEL = "mb-2 block text-[11px] tracking-[0.08em] uppercase text-ink-3";

/** Tuỳ chỉnh đọc: cỡ chữ, nền, kiểu chữ. Ghi thẳng vào store, không cần prop onChange. */
export function ReaderSettings({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Tuỳ chỉnh đọc">
      <button
        type="button"
        aria-label="Đóng tuỳ chỉnh"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/40"
      />

      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[560px] rounded-t-lg border border-line bg-paper p-6 md:inset-x-auto md:top-20 md:right-6 md:bottom-auto md:rounded-lg">
        <Section title="Cỡ chữ">
          <div className="flex gap-2">
            {READER_SIZES.map((size, index) => (
              <SizeButton key={size} size={size} index={index} />
            ))}
          </div>
        </Section>

        <Section title="Nền">
          <div className="flex gap-2">
            {(Object.keys(READER_THEMES) as ReaderThemeKey[]).map((key) => (
              <ThemeSwatch key={key} themeKey={key} />
            ))}
          </div>
        </Section>

        <Section title="Kiểu chữ">
          <div className="flex gap-2">
            <FontButton label="Literata" serif className="font-read" />
            <FontButton label="Inter" serif={false} className="font-sans" />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 last:mb-0">
      <span className={LABEL}>{title}</span>
      {children}
    </div>
  );
}

function SizeButton({ size, index }: { size: number; index: number }) {
  return (
    <button
      type="button"
      aria-label={`Cỡ chữ ${size}`}
      onClick={() => setReaderPrefs({ sizeIndex: index })}
      className="grid h-11 flex-1 place-items-center rounded-lg border border-ash font-serif text-ink hover:border-ink"
      style={{ fontSize: `${11 + index}px` }}>
      A
    </button>
  );
}

function ThemeSwatch({ themeKey }: { themeKey: ReaderThemeKey }) {
  const theme = READER_THEMES[themeKey];
  return (
    <button
      type="button"
      aria-label={theme.label}
      onClick={() => setReaderPrefs({ theme: themeKey })}
      className="grid h-11 flex-1 place-items-center rounded-lg border border-ash text-[11px]"
      style={{ backgroundColor: theme.bg, color: theme.fg }}>
      {theme.label}
    </button>
  );
}

function FontButton({
  label,
  serif,
  className,
}: {
  label: string;
  serif: boolean;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={() => setReaderPrefs({ serif })}
      className={`${className} flex-1 rounded-lg border border-ash py-3 text-sm text-ink hover:border-ink`}>
      {label}
    </button>
  );
}
