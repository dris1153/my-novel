import { cn } from "@/lib/cn";

/** Chip viền xanh dạng viên thuốc — thể loại, trạng thái. `active` tô đặc (chip đang chọn). */
export function Tag({
  children,
  active = false,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3.5 py-2 text-[13px] leading-none font-medium whitespace-nowrap",
        active ? "border-accent bg-accent text-on-accent" : "border-accent-fg/60 bg-surface text-accent-fg",
        className
      )}>
      {children}
    </span>
  );
}
