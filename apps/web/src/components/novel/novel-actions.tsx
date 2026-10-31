import { FollowButton } from "./follow-button";

import { ButtonLink } from "@/components/ui/button";
import { readMyStateOrEmpty } from "@/lib/state-store";

/**
 * Thanh hành động ghim đáy trang truyện (thay chỗ tab bar): theo dõi + "Đọc tiếp chương N".
 * Màu nhấn chỉ dùng cho nút đọc — hành động chính duy nhất của trang.
 */
export async function NovelActions({ slug, firstNumber }: { slug: string; firstNumber: number | null }) {
  const state = await readMyStateOrEmpty();
  const resume = state.progress[slug]?.chapter ?? null;
  const target = resume ?? firstNumber;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto flex w-full max-w-[760px] gap-3">
        <FollowButton slug={slug} initialSaved={state.library.some((e) => e.slug === slug)} iconOnly />
        {target !== null ? (
          <ButtonLink href={`/truyen/${slug}/chuong/${target}`} className="min-h-13 flex-1 text-[15px]">
            {resume ? `Đọc tiếp chương ${resume}` : "Đọc từ đầu"}
          </ButtonLink>
        ) : (
          <span className="flex min-h-13 flex-1 items-center justify-center rounded-xl bg-surface text-sm text-fg-2">
            Chưa có chương nào
          </span>
        )}
      </div>
    </div>
  );
}
