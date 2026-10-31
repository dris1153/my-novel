import Image from "next/image";

import { cn } from "@/lib/cn";

/** Bìa thiếu ảnh vẫn phải phân biệt được → màu suy từ slug (hoặc màu bìa đã tính sẵn). */
const FALLBACKS = ["#3b4f6b", "#5b3a3a", "#3f5a3d", "#4f3f63", "#6b5530", "#2f5c59"];

function colorFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return FALLBACKS[Math.abs(h) % FALLBACKS.length];
}

export function NovelCover({
  uri,
  title,
  seed,
  color,
  sizes = "(min-width:1024px) 200px, (min-width:640px) 30vw, 45vw",
  priority = false,
  className,
}: {
  uri: string | null;
  title: string;
  seed: string;
  color?: string | null;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[2/3] w-full overflow-hidden rounded-cover bg-subtle shadow-sm ring-1 ring-line/60",
        className
      )}>
      {uri ? (
        <Image
          src={uri}
          alt={`Bìa truyện ${title}`}
          fill
          sizes={sizes}
          priority={priority}
          // Bìa đã nén ≤600px/100KB lúc crawl; tối ưu lại chỉ thêm một lượt fetch qua route có đăng nhập.
          unoptimized
          className="object-cover"
        />
      ) : (
        <div
          className="flex h-full w-full items-end bg-gradient-to-b from-white/5 to-black/40 p-2"
          style={{ backgroundColor: color ?? colorFor(seed) }}>
          {/* Nền fallback luôn tối nên chữ cố định màu sáng, không theo theme. */}
          <span className="line-clamp-3 font-heading text-[13px] leading-tight font-semibold text-[#f4efe6]">
            {title}
          </span>
        </div>
      )}
    </div>
  );
}
