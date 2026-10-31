import Link from "next/link";

import type { GenreTile } from "@/lib/queries";
import { cn } from "@/lib/cn";

/** Cột thể loại nền slate bên trái carousel (màn rộng), kèm số truyện. */
export function GenrePanel({ genres, className }: { genres: GenreTile[]; className?: string }) {
  return (
    <nav
      aria-label="Thể loại"
      className={cn("no-scrollbar overflow-y-auto rounded-card bg-bar py-2 text-on-bar [--focus-offset:-3px] [--focus-ring:var(--on-bar)]", className)}>
      <ul>
        {genres.map((genre) => (
          <li key={genre.slug}>
            <Link
              href={`/the-loai/${genre.slug}`}
              className="flex items-center justify-between gap-2 px-4 py-2 text-sm hover:bg-on-bar/10">
              <span className="truncate">{genre.name}</span>
              <span className="text-xs text-on-bar/70 tabular-nums">{genre.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
