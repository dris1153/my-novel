import Link from "next/link";

import { AuthSlot } from "./auth-slot";
import { NavLink } from "./nav-link";
import { DESKTOP_NAV, SearchIcon } from "./nav-items";
import { SearchForm } from "./search-form";

import { getAuthorizedUser } from "@/lib/auth";

/**
 * Hàng trắng (wordmark + tìm kiếm) dính trên cùng; màn rộng thêm thanh nav slate bên dưới,
 * cuộn theo trang để không chiếm chỗ đọc.
 */
export async function Header() {
  const user = await getAuthorizedUser();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-surface">
        <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center gap-6 px-4 lg:h-16 lg:px-6">
          <Link href="/" className="font-heading text-2xl leading-none font-bold text-accent-fg">
            Truyện
          </Link>

          {user && (
            <>
              <SearchForm className="hidden max-w-[520px] flex-1 lg:flex" />
              <div className="ml-auto flex items-center gap-2">
                <Link
                  href="/tim-kiem"
                  aria-label="Tìm kiếm"
                  className="grid size-11 place-items-center rounded-full text-fg hover:bg-hover lg:hidden">
                  <SearchIcon />
                </Link>
                <AuthSlot name={user.name ?? user.email?.split("@")[0] ?? "Tôi"} />
              </div>
            </>
          )}
        </div>
      </header>

      {user && (
        <nav aria-label="Danh mục" className="hidden bg-bar [--focus-offset:-3px] [--focus-ring:var(--on-bar)] lg:block">
          <div className="mx-auto flex w-full max-w-[1200px] px-6">
            {DESKTOP_NAV.map(({ href, label }) => (
              <NavLink key={href} href={href}>
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}
