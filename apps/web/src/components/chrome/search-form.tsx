import { SearchIcon } from "./nav-items";

import { cn } from "@/lib/cn";

/** Ô tìm dạng viên thuốc, GET thẳng tới `/tim-kiem?q=` nên không cần JS; Enter là gửi. Trang tìm kiếm có thêm nút. */
export function SearchForm({
  defaultValue,
  autoFocus = false,
  withButton = false,
  className,
}: {
  defaultValue?: string;
  autoFocus?: boolean;
  withButton?: boolean;
  className?: string;
}) {
  return (
    <form action="/tim-kiem" method="get" role="search" className={cn("flex gap-2", className)}>
      <label className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-control border border-line-strong bg-surface px-4 text-fg-2 focus-within:border-accent-fg">
        <SearchIcon />
        <input
          name="q"
          defaultValue={defaultValue}
          placeholder="Tìm truyện, tác giả…"
          aria-label="Từ khoá tìm kiếm (không cần dấu)"
          autoFocus={autoFocus}
          className="min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-fg-3"
        />
      </label>
      {withButton && (
        <button
          type="submit"
          className="min-h-11 shrink-0 rounded-control bg-accent px-5 text-sm font-semibold text-on-accent hover:bg-accent-hover">
          Tìm
        </button>
      )}
    </form>
  );
}
