import Link from "next/link";

import { Tag } from "@/components/ui/tag";
import type { Genre } from "@/lib/queries";

export function GenreChips({ genres }: { genres: Genre[] }) {
  if (genres.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <Link key={genre.slug} href={`/the-loai/${genre.slug}`} className="transition-opacity hover:opacity-80">
          <Tag tone="forest">{genre.name}</Tag>
        </Link>
      ))}
    </div>
  );
}
