import { cn } from "@/lib/cn";

/** Chip viền xanh dạng viên thuốc — thể loại, trạng thái. */
export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-accent-fg/60 bg-surface px-3.5 py-2 text-[13px] leading-none font-medium whitespace-nowrap text-accent-fg",
        className
      )}>
      {children}
    </span>
  );
}
