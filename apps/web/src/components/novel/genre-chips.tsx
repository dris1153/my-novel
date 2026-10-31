import Link from "next/link";

import { cn } from "@/lib/cn";
import type { Genre } from "@/lib/queries";

const CHIP = "inline-flex min-h-11 shrink-0 items-center rounded-full px-5 text-sm font-semibold transition-colors";

/** Hàng chip thể loại (cuộn ngang trên điện thoại); chip đầu "Tất cả" dẫn về trang Thể loại. */
export function GenreChips({ genres, activeSlug }: { genres: Genre[]; activeSlug?: string }) {
  if (genres.length === 0) return null;

  const chips = [{ slug: undefined, name: "Tất cả", href: "/the-loai" }, ...genres.map((g) => ({ ...g, href: `/the-loai/${g.slug}` }))];

  return (
    <nav aria-label="Thể loại" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
      {chips.map(({ slug, name, href }) => {
        const active = slug === activeSlug;
        return (
          <Link
            key={href}
            href={href}
            aria-current={slug && active ? "page" : undefined}
            className={cn(CHIP, active ? "bg-accent text-on-accent" : "bg-tint-lavender text-fg hover:bg-hover")}>
            {name}
          </Link>
        );
      })}
    </nav>
  );
}
