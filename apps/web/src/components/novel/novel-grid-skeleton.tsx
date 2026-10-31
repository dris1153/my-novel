import { Skeleton } from "@/components/ui/skeleton";

/** Khớp đúng khối + lưới của PagedNovelGrid để nội dung về không làm nhảy layout. */
export function NovelGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="mt-4 rounded-card bg-surface p-3 lg:p-5">
      <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 lg:grid-cols-6 lg:gap-x-5">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>
            <Skeleton className="aspect-[2/3] w-full rounded-cover" />
            <Skeleton className="mt-2 h-4 w-4/5" />
            <Skeleton className="mt-1.5 h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
