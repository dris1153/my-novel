import { Skeleton } from "@/components/ui/skeleton";

/** Khối chờ cho danh sách chương / mục lục — cùng chiều cao dòng (48px). */
export function ChapterListSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex min-h-12 items-center gap-3 border-b border-line">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-4 w-full max-w-[420px]" />
        </div>
      ))}
    </div>
  );
}
