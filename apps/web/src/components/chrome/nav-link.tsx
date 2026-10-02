"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/cn";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "text-sm text-ink-2 transition-colors hover:text-ink",
        active && "text-ink"
      )}>
      {children}
    </Link>
  );
}
