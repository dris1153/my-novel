import { Skeleton } from "@/components/ui/skeleton";

/** Khối chờ cho danh sách chương / mục lục — cùng chiều cao dòng (ô số 36px). */
export function ChapterListSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex min-h-14 items-center gap-3 border-b border-line last:border-b-0">
          <Skeleton className="h-9 w-11 rounded-xl" />
          <Skeleton className="h-4 w-full max-w-[420px]" />
        </div>
      ))}
    </div>
  );
}
