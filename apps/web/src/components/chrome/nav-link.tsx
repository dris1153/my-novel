"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { isActive } from "./nav-items";

import { cn } from "@/lib/cn";

/** Mục trên sidebar (màn hình rộng, thay cho tab bar). */
export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const active = isActive(usePathname(), href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm transition-colors",
        active ? "bg-accent-soft font-bold text-accent-fg" : "font-semibold text-fg-2 hover:bg-hover hover:text-fg"
      )}>
      {children}
    </Link>
  );
}
