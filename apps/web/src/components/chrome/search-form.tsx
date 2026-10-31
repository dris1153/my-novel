import { SearchIcon } from "./nav-items";

import { cn } from "@/lib/cn";

/** Ô tìm kiếm + nút xanh, GET thẳng tới `/tim-kiem?q=` nên không cần JS. Dùng ở header, trang chủ, trang tìm. */
export function SearchForm({
  defaultValue,
  autoFocus = false,
  className,
}: {
  defaultValue?: string;
  autoFocus?: boolean;
  className?: string;
}) {
  return (
    <form action="/tim-kiem" method="get" role="search" className={cn("flex", className)}>
      <label className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-l-control border border-r-0 border-line-strong bg-subtle px-3 text-fg-2 focus-within:border-accent-fg">
        <SearchIcon />
        <input
          name="q"
          defaultValue={defaultValue}
          placeholder="Tìm truyện, tác giả… (không cần dấu)"
          aria-label="Từ khoá tìm kiếm"
          autoFocus={autoFocus}
          className="min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-fg-3"
        />
      </label>
      <button
        type="submit"
        className="min-h-11 shrink-0 rounded-r-control bg-accent px-5 text-sm font-semibold text-on-accent hover:bg-accent-hover">
        Tìm
      </button>
    </form>
  );
}
