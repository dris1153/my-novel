"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV, isActive } from "./nav-items";

import { cn } from "@/lib/cn";

export function TabBar() {
  const pathname = usePathname();
  if (pathname === "/dang-nhap") return null;

  return (
    <nav
      aria-label="Điều hướng chính"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
      {NAV.map(({ href, label, Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-16 flex-col items-center justify-center gap-1 text-[11px]",
              active ? "font-semibold text-accent-fg" : "text-fg-2 hover:text-fg"
            )}>
            <Icon />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
