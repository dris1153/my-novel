import Link from "next/link";

import { cn } from "@/lib/cn";

/** Tiêu đề mục có vạch xanh bên trái + link "Thêm →" tuỳ chọn ở bên phải. */
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
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <h2 className="min-w-0 border-l-4 border-accent pl-2.5 font-heading text-lg leading-snug font-bold text-fg">
        {title}
      </h2>
      {action && (
        <Link
          href={action.href}
          className="inline-flex min-h-11 shrink-0 items-center text-sm font-medium text-accent-fg hover:underline">
          {action.label}
        </Link>
      )}
    </div>
  );
}
