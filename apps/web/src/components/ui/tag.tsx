import { cn } from "@/lib/cn";

/** Thể loại dùng `forest`; còn lại là tag viền mảnh. Cả hai radius 10px. */
export function Tag({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "forest" | "muted";
  className?: string;
}) {
  const tones = {
    default: "border border-ash text-ink-2",
    forest: "bg-forest-soft text-forest",
    muted: "border border-line text-ink-3",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] leading-none",
        tones[tone],
        className
      )}>
      {children}
    </span>
  );
}
