import { Skeleton } from "@/components/ui/skeleton";

/** Khối chờ cho danh sách chương / mục lục. */
export function ChapterListSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="border-t border-line">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="border-b border-line py-3.5">
          <Skeleton className="h-4 w-full max-w-[420px]" />
        </div>
      ))}
    </div>
  );
}
