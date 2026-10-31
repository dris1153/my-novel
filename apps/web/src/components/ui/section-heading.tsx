import Link from "next/link";

import { cn } from "@/lib/cn";

/** Tiêu đề mục (serif) + link "Xem tất cả" tuỳ chọn ở bên phải. */
export function SectionHeading({
  title,
  action,
  className,
}: {
  title: string;
  action?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        <h2 className="font-serif text-xl leading-tight font-semibold text-fg">{title}</h2>
      </div>
      {action && (
        <Link href={action.href} className="inline-flex min-h-11 shrink-0 items-center text-sm font-medium text-fg-2 hover:text-fg">
          {action.label}
        </Link>
      )}
    </div>
  );
}
