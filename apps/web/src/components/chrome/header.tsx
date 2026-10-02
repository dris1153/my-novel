import Link from "next/link";

import { HeaderAuthSlot } from "./auth-slot";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { href: "/", label: "Trang chủ" },
  { href: "/the-loai", label: "Thể loại" },
  { href: "/tim-kiem", label: "Tìm kiếm" },
  { href: "/tu-truyen", label: "Tủ truyện" },
];

/** Header Bar Opennote: transparent, 1px hairline dưới, không shadow, không sticky. */
export function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <div className="flex h-[68px] items-center gap-6">
          <Link href="/" className="font-serif text-[22px] leading-none text-ink">
            Truyện
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
            {NAV.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 md:ml-0">
            <ThemeToggle />
            <HeaderAuthSlot />
          </div>
        </div>

        {/* Mobile: nav xuống hàng dưới, cuộn ngang nếu chật. */}
        <nav className="-mx-6 flex items-center gap-6 overflow-x-auto px-6 pb-3 md:hidden">
          {NAV.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
