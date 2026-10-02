import Image from "next/image";

import { cn } from "@/lib/cn";

/** Bìa thiếu ảnh vẫn phải phân biệt được → màu suy từ slug, tông trầm Opennote. */
const FALLBACKS = ["#5b4636", "#2f3a52", "#4a3c5c", "#38503a", "#6b5330", "#4b3040"];

function colorFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return FALLBACKS[Math.abs(h) % FALLBACKS.length];
}

export function NovelCover({
  uri,
  title,
  seed,
  sizes = "(min-width:1024px) 200px, (min-width:640px) 30vw, 45vw",
  priority = false,
  className,
}: {
  uri: string | null;
  title: string;
  seed: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[2/3] w-full overflow-hidden rounded-lg border border-line bg-halo",
        className
      )}>
      {uri ? (
        <Image
          src={uri}
          alt={`Bìa truyện ${title}`}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          className="flex h-full w-full items-end p-2"
          style={{ backgroundColor: colorFor(seed) }}>
          {/* Nền fallback luôn tối nên chữ phải là ivory cố định, không theo theme. */}
          <span className="line-clamp-3 font-serif text-[13px] leading-tight text-[#fffdf8]">
            {title}
          </span>
        </div>
      )}
    </div>
  );
}
