import { cn } from "@/lib/cn";

/**
 * Khối chờ nội dung. Dùng đúng phần pulse của snippet skeleton (14) — Next thay
 * cả cây khi dữ liệu về nên nửa cross-fade của snippet không áp được.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className="t-skel-skeleton is-pulsing">
      <div className={cn("rounded-lg bg-halo", className)} />
    </div>
  );
}
