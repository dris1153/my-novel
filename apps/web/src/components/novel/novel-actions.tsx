import { FollowButton } from "./follow-button";

import { ButtonLink } from "@/components/ui/button";
import { readMyStateOrEmpty } from "@/lib/state-store";

/** CTA đọc: "Đọc tiếp chương N" nếu đã có tiến độ, kèm nút theo dõi. */
export async function NovelActions({ slug, firstNumber }: { slug: string; firstNumber: number | null }) {
  const state = await readMyStateOrEmpty();
  const resume = state.progress[slug]?.chapter ?? null;
  const target = resume ?? firstNumber;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {target !== null && (
        <ButtonLink href={`/truyen/${slug}/chuong/${target}`}>
          {resume ? `Đọc tiếp chương ${resume}` : "Đọc từ đầu"}
        </ButtonLink>
      )}
      <FollowButton slug={slug} initialSaved={state.library.some((e) => e.slug === slug)} />
    </div>
  );
}
