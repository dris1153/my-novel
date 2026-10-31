import Image from "next/image";

import { cn } from "@/lib/cn";

export type IllustrationName = "empty-library" | "no-results" | "no-chapters" | "not-found" | "error";

/**
 * Tranh màu nền trong suốt ở `public/art/` (dùng được trên cả nền sáng lẫn tối).
 * Chỉ để trang trí — luôn đi kèm chữ nói cùng nội dung, nên `alt=""`.
 */
export function Illustration({ name, className }: { name: IllustrationName; className?: string }) {
  return (
    <Image
      src={`/art/${name}.webp`}
      alt=""
      width={384}
      height={384}
      // `/_next/image` nằm sau cổng đăng nhập (trang lỗi/404 có thể hiện trước khi đăng nhập); ảnh đã nén sẵn.
      unoptimized
      className={cn("size-44", className)}
    />
  );
}
