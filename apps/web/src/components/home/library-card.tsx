import Image from "next/image";
import Link from "next/link";

import { BookmarkBadge } from "./home-heading";

import { cn } from "@/lib/cn";

/** "Tủ truyện của bạn": số truyện đang theo dõi + mèo đọc sách. */
export function LibraryCard({ count, className }: { count: number; className?: string }) {
  return (
    <Link
      href="/tu-truyen?tab=theo-doi"
      className={cn("relative flex min-h-[128px] flex-col overflow-hidden rounded-card bg-tint-peach p-5 pr-28", className)}>
      <span className="flex items-center gap-2 font-heading text-[17px] font-extrabold text-fg">
        <BookmarkBadge />
        Tủ truyện của bạn
      </span>
      <span className="mt-auto pt-2 text-sm text-fg-2">
        <span className="mr-1.5 font-heading text-[32px] leading-none font-extrabold text-fg">{count}</span>
        truyện
      </span>
      <Image src="/art/cat-reading.webp" alt="" width={100} height={120} unoptimized className="absolute right-3 bottom-1" />
    </Link>
  );
}
