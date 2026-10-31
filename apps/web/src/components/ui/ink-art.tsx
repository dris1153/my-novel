import { cn } from "@/lib/cn";

export type InkArtName =
  | "sign-in"
  | "home-banner"
  | "empty-library"
  | "no-results"
  | "no-chapters"
  | "not-found"
  | "error";

/**
 * Tranh thủy mặc trong `public/art/` là mask (alpha = độ đậm mực); màu do CSS tô theo theme,
 * nên một file phục vụ cả dark và light. Chỉ để trang trí — luôn đi kèm chữ nói cùng nội dung.
 */
export function InkArt({
  name,
  position = "center",
  className,
}: {
  name: InkArtName;
  position?: "center" | "right";
  className?: string;
}) {
  const mask = `url(/art/${name}.webp)`;
  const place = position === "right" ? "right bottom" : "center";

  return (
    <div
      aria-hidden
      className={cn("bg-ink-art opacity-75 dark:opacity-90", className)}
      style={{
        maskImage: mask,
        WebkitMaskImage: mask,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: place,
        WebkitMaskPosition: place,
      }}
    />
  );
}
