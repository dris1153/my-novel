import { cn } from "@/lib/cn";

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
}: {
  title: string;
  subtitle?: string;
  align?: "center" | "left" | "between";
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" && "text-center",
        align === "between" && "flex flex-wrap items-end justify-between gap-4",
        className
      )}>
      <div>
        <h2 className="font-serif text-[32px] leading-[1.12] font-normal text-ink">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-ink-3">{subtitle}</p>}
      </div>
    </div>
  );
}

/** Tiêu đề mục trong trang (nhỏ hơn SectionHeading) — luôn serif. */
export function SubHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h2 className={cn("font-serif text-subheading text-ink", className)}>{children}</h2>;
}
