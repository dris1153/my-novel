import Image from "next/image";
import Link from "next/link";

import { DESKTOP_NAV, GearIcon, SunIcon } from "./nav-items";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme-toggle";

import { getAuthorizedUser } from "@/lib/auth";

/** Thanh điều hướng trái ở màn rộng; điện thoại dùng tab bar. Chưa đăng nhập thì không có. */
export async function Sidebar() {
  const user = await getAuthorizedUser();
  if (!user) return null;

  return (
    <aside className="no-scrollbar sticky top-0 hidden h-dvh w-[180px] shrink-0 flex-col overflow-y-auto border-r border-line lg:flex">
      <Link href="/" className="flex flex-col items-center gap-1 pt-6 pb-8 font-heading text-2xl font-extrabold text-fg [--focus-offset:-3px]">
        {/* Ảnh art đã nén sẵn; `/_next/image` nằm sau cổng đăng nhập. */}
        <Image src="/art/logo-book.webp" alt="" width={72} height={68} unoptimized priority />
        Truyện
      </Link>

      <nav aria-label="Điều hướng chính" className="flex flex-col gap-2 px-3">
        {DESKTOP_NAV.map(({ href, label, Icon }) => (
          <NavLink key={href} href={href}>
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <Image src="/art/mascot-cat.webp" alt="" width={160} height={165} unoptimized className="-mb-2 ml-1 [@media(max-height:760px)]:hidden" />
        <div className="mx-3 mb-4 rounded-2xl bg-subtle px-3 py-2">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-fg-2 [&_svg]:size-4">
            <SunIcon />
            Giao diện
          </p>
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <Link
              href="/toi"
              aria-label="Tài khoản và cài đặt"
              className="grid size-11 place-items-center rounded-full text-fg-2 hover:bg-hover hover:text-fg">
              <GearIcon />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
