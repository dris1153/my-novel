import Link from "next/link";

import { Tag } from "@/components/ui/tag";
import type { Genre } from "@/lib/queries";

/** Hàng chip thể loại cuộn ngang; chip đầu "Tất cả" dẫn về trang Thể loại. */
export function GenreChips({ genres, activeSlug }: { genres: Genre[]; activeSlug?: string }) {
  if (genres.length === 0) return null;

  return (
    <nav aria-label="Thể loại" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:px-0">
      <Link href="/the-loai" className="shrink-0 py-1.5">
        <Tag active={!activeSlug}>Tất cả</Tag>
      </Link>
      {genres.map((genre) => (
        <Link
          key={genre.slug}
          href={`/the-loai/${genre.slug}`}
          aria-current={genre.slug === activeSlug ? "page" : undefined}
          className="shrink-0 py-1.5">
          <Tag active={genre.slug === activeSlug}>{genre.name}</Tag>
        </Link>
      ))}
    </nav>
  );
}
