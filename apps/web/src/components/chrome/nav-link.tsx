"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { isActive } from "./nav-items";

import { cn } from "@/lib/cn";

/** Mục điều hướng ngang trên header (màn hình rộng, thay cho tab bar). */
export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const active = isActive(usePathname(), href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-lg px-3 py-2 text-sm transition-colors",
        active ? "font-semibold text-accent-fg" : "text-fg-2 hover:bg-hover hover:text-fg"
      )}>
      {children}
    </Link>
  );
}
