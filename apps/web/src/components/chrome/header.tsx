import Image from "next/image";
import Link from "next/link";

import { SearchIcon } from "./nav-items";
import { SearchForm } from "./search-form";
import { UserAvatar } from "./user-avatar";

import { getAuthorizedUser } from "@/lib/auth";
import { cn } from "@/lib/cn";

/** Màn rộng: ô tìm + nút tài khoản (logo nằm ở sidebar). Điện thoại: logo + nút tìm + ảnh. */
export async function Header() {
  const user = await getAuthorizedUser();
  const name = user?.name ?? user?.email?.split("@")[0] ?? "Tôi";

  return (
    <header className="sticky top-0 z-30 bg-canvas">
      <div className="mx-auto flex h-14 w-full max-w-[1320px] items-center gap-3 px-4 lg:h-[72px] lg:px-6">
        <Link
          href="/"
          className={cn("flex items-center gap-2 font-heading text-xl font-extrabold text-fg", user && "lg:hidden")}>
          <Image src="/art/logo-book.webp" alt="" width={36} height={34} unoptimized />
          Truyện
        </Link>

        {user && (
          <>
            <SearchForm className="hidden max-w-[400px] flex-1 lg:flex" />
            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/tim-kiem"
                aria-label="Tìm kiếm"
                className="grid size-11 place-items-center rounded-full text-fg hover:bg-hover lg:hidden">
                <SearchIcon />
              </Link>
              <Link href="/toi" aria-label={`Tài khoản: ${name}`} className="flex min-h-11 items-center gap-3 rounded-full">
                <span className="hidden max-w-[200px] truncate rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-semibold text-fg lg:block">
                  {name}
                </span>
                <UserAvatar name={name} image={user.image} />
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
