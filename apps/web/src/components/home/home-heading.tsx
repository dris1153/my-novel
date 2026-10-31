import Link from "next/link";

import { cn } from "@/lib/cn";

/** Tiêu đề khối trên trang chủ: icon + tên + link phụ bên phải. */
export function HomeHeading({
  icon,
  title,
  action,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  action?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <h2 className="flex min-w-0 items-center gap-2 font-heading text-xl font-extrabold text-fg">
        {icon}
        <span className="truncate">{title}</span>
      </h2>
      {action && (
        <Link
          href={action.href}
          className="inline-flex min-h-11 shrink-0 items-center text-[13px] font-semibold text-fg hover:text-accent-fg">
          {action.label}
        </Link>
      )}
    </div>
  );
}

const ICON = { width: 24, height: 24, viewBox: "0 0 24 24", "aria-hidden": true } as const;
const STROKE = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export function FlameBadge() {
  return (
    <svg {...ICON} className="shrink-0 text-orange-500" fill="currentColor">
      <path d="M12 2c.6 3.8-5.5 6.6-5.5 12.2a5.5 5.5 0 0 0 11 0c0-2.3-1.2-4-2.4-5.2-.3 1.7-1.2 2.6-2.3 3.2.4-3.7-.4-7.4-.8-10.2z" />
    </svg>
  );
}

export function StarBadge() {
  return (
    <svg {...ICON} className="shrink-0 text-amber-400" fill="currentColor">
      <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.2-5.9 3.2 1.2-6.5-4.8-4.6 6.6-.9z" />
    </svg>
  );
}

export function ClockBadge() {
  return (
    <svg {...ICON} {...STROKE} className="shrink-0 text-accent-fg">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function BookBadge() {
  return (
    <svg {...ICON} {...STROKE} className="shrink-0 text-accent-fg">
      <path d="M12 6.5C10.5 5 8 4.5 4 4.5v14c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-14c-4 0-6.5.5-8 2z" />
      <path d="M12 6.5v14" />
    </svg>
  );
}

export function BookmarkBadge() {
  return (
    <svg {...ICON} {...STROKE} className="shrink-0 text-fg">
      <path d="M6 4h12v16l-6-4-6 4z" />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg aria-hidden width="14" height="14" viewBox="0 0 12 12" fill="currentColor">
      <path d="M2.5 1v10l8.5-5z" />
    </svg>
  );
}
