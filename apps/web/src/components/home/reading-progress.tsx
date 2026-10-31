import { cn } from "@/lib/cn";

/** Thanh tiến độ trên thẻ pastel; nền `surface` để nổi trên cả tint sáng lẫn tối. */
export function ReadingProgress({ chapter, total, className }: { chapter: number; total: number; className?: string }) {
  const percent = Math.min(100, Math.round((chapter / Math.max(1, total)) * 100));
  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-surface", className)} aria-hidden>
      <div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
    </div>
  );
}
