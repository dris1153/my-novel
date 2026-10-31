import { Skeleton } from "@/components/ui/skeleton";

/** Khớp đúng lưới của NovelGrid để nội dung về không làm nhảy layout. */
export function NovelGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-4 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-[20px] bg-surface p-2 pb-3">
          <Skeleton className="aspect-[2/3] w-full rounded-cover" />
          <Skeleton className="mt-2 h-4 w-4/5" />
          <Skeleton className="mt-1.5 h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}
