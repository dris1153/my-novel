import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";

/** Thẻ trang trí dẫn tới Thể loại. */
export function PromoCard({ className }: { className?: string }) {
  return (
    <section className={cn("relative flex min-h-[220px] flex-col items-start justify-center overflow-hidden rounded-card bg-tint-sky p-6 lg:p-8", className)}>
      <h2 className="max-w-[60%] font-heading text-2xl leading-tight font-extrabold text-fg lg:text-[28px]">
        Cùng nhau đọc truyện nhé!
      </h2>
      <p className="mt-2 max-w-[55%] text-sm text-fg-2">Khám phá, lưu trữ và theo dõi những bộ truyện yêu thích.</p>
      <Link
        href="/the-loai"
        className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-on-ink hover:opacity-90">
        Khám phá ngay <span aria-hidden>→</span>
      </Link>
      <Image
        src="/art/boy-cat.webp"
        alt=""
        width={220}
        height={226}
        unoptimized
        className="absolute right-0 -bottom-2 w-[42%] max-w-[220px]"
      />
    </section>
  );
}
