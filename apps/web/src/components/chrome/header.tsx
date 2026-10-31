import Link from "next/link";

import { AuthSlot } from "./auth-slot";
import { NavLink } from "./nav-link";
import { NAV, SearchIcon } from "./nav-items";

import { getAuthorizedUser } from "@/lib/auth";

/** Header gọn: wordmark + tìm kiếm. Màn rộng thêm nav ngang (thay tab bar) và tên người dùng. */
export async function Header() {
  const user = await getAuthorizedUser();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/95">
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center gap-4 px-4 lg:px-6">
        <Link href="/" className="font-serif text-xl leading-none font-bold text-fg">
          Truyện
        </Link>

        {user && (
          <>
            <nav aria-label="Điều hướng chính" className="hidden flex-1 items-center gap-1 lg:flex">
              {NAV.map(({ href, label }) => (
                <NavLink key={href} href={href}>
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/tim-kiem"
                aria-label="Tìm kiếm"
                className="grid size-11 place-items-center rounded-full text-fg hover:bg-hover">
                <SearchIcon />
              </Link>
              <AuthSlot name={user.name ?? user.email?.split("@")[0] ?? "Tôi"} />
            </div>
          </>
        )}
      </div>
    </header>
  );
}
