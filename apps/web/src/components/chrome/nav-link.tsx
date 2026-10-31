"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { isActive } from "./nav-items";

import { cn } from "@/lib/cn";

/** Mục trên thanh nav slate (màn hình rộng, thay cho tab bar). */
export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const active = isActive(usePathname(), href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-11 items-center px-4 font-heading text-[15px] font-semibold tracking-wide uppercase transition-colors",
        active ? "bg-accent text-on-accent" : "text-on-bar/85 hover:bg-on-bar/10 hover:text-on-bar"
      )}>
      {children}
    </Link>
  );
}
