import { FollowButton } from "./follow-button";

import { PlayIcon } from "@/components/home/home-heading";
import { ReadingProgress } from "@/components/home/reading-progress";
import { ButtonLink } from "@/components/ui/button";
import { fetchChapterNumbers } from "@/lib/queries";
import { readMyStateOrEmpty } from "@/lib/state-store";

/**
 * Tiến độ + hàng nút: "Đọc tiếp chương N" (nhấn) · "Mục lục" · theo dõi.
 * Màu nhấn chỉ dùng cho nút đọc — hành động chính duy nhất của trang.
 */
export async function NovelActions({ slug }: { slug: string }) {
  const [state, numbers] = await Promise.all([readMyStateOrEmpty(), fetchChapterNumbers(slug)]);
  const saved = state.progress[slug]?.chapter;
  // Chương đã đọc có thể không còn (truyện crawl lại ngắn hơn, hoặc chương lỗi bị bỏ): mời đọc từ đầu thay vì link 404.
  const resume = saved !== undefined && numbers.includes(saved) ? saved : null;
  const target = resume ?? numbers[0] ?? null;
  // Cùng mẫu số "chương N / M" với trình đọc: số của chương cuối, không phải số lượng.
  const last = numbers.at(-1) ?? 0;

  return (
    <>
      {resume !== null && (
        <div className="max-w-[560px]">
          <p className="text-sm text-fg-2">
            Đã đọc <span className="font-semibold text-fg tabular-nums">{resume} / {last}</span>
          </p>
          <ReadingProgress chapter={resume} total={last} className="mt-2 h-2" />
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
        {target !== null ? (
          <ButtonLink href={`/truyen/${slug}/chuong/${target}`} className="col-span-2 min-h-12 text-[15px]">
            <PlayIcon />
            {resume ? `Đọc tiếp chương ${resume}` : "Đọc từ đầu"}
          </ButtonLink>
        ) : (
          <span className="col-span-2 flex min-h-12 items-center justify-center rounded-control bg-surface/70 px-5 text-sm text-fg-2">
            Chưa có chương nào
          </span>
        )}
        <ButtonLink href={`/truyen/${slug}/muc-luc`} variant="tonal" className="min-h-12 text-[15px]">
          <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
          </svg>
          Mục lục
        </ButtonLink>
        <FollowButton slug={slug} initialSaved={state.library.some((e) => e.slug === slug)} />
      </div>
    </>
  );
}
