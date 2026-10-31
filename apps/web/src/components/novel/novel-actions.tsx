import { FollowButton } from "./follow-button";

import { ButtonLink } from "@/components/ui/button";
import { readMyStateOrEmpty } from "@/lib/state-store";

/**
 * Hàng nút ngay dưới khối thông tin: "Đọc tiếp chương N" (xanh) · "DS.Chương" (xám) · theo dõi.
 * Màu nhấn chỉ dùng cho nút đọc — hành động chính duy nhất của trang.
 */
export async function NovelActions({ slug, firstNumber }: { slug: string; firstNumber: number | null }) {
  const state = await readMyStateOrEmpty();
  const resume = state.progress[slug]?.chapter ?? null;
  const target = resume ?? firstNumber;

  return (
    <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      {target !== null ? (
        <ButtonLink href={`/truyen/${slug}/chuong/${target}`} className="col-span-2 min-h-12 text-[15px]">
          {resume ? `Đọc tiếp chương ${resume}` : "Đọc từ đầu"}
        </ButtonLink>
      ) : (
        <span className="col-span-2 flex min-h-12 items-center justify-center rounded-control bg-subtle px-5 text-sm text-fg-2">
          Chưa có chương nào
        </span>
      )}
      <ButtonLink variant="secondary" href={`/truyen/${slug}/muc-luc`} className="min-h-12">
        DS.Chương
      </ButtonLink>
      <FollowButton slug={slug} initialSaved={state.library.some((e) => e.slug === slug)} />
    </div>
  );
}
