import { cn } from "@/lib/cn";

/** Chip dạng viên thuốc — thể loại, trạng thái. `active` đảo màu (chip đang chọn). */
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
        "inline-flex items-center rounded-full border px-3.5 py-2 text-[13px] leading-none font-medium",
        active ? "border-fg bg-fg text-canvas" : "border-line bg-subtle text-fg-2",
        className
      )}>
      {children}
    </span>
  );
}
