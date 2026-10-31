import { ButtonLink } from "@/components/ui/button";
import { InkArt, type InkArtName } from "@/components/ui/ink-art";

export type EmptyArt = Extract<InkArtName, "empty-library" | "no-results" | "no-chapters" | "not-found" | "error">;

/** Trạng thái trống: tranh thủy mặc + tiêu đề + mô tả + hành động. */
export function EmptyState({
  art,
  title,
  description,
  action,
}: {
  art: EmptyArt;
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center" data-art={art}>
      <InkArt name={art} className="size-48" />
      <p className="mt-6 font-serif text-xl font-semibold text-fg">{title}</p>
      {description && <p className="mt-2 max-w-[40ch] text-sm text-fg-2">{description}</p>}
      {action && (
        <ButtonLink variant="ghost" href={action.href} className="mt-6">
          {action.label}
        </ButtonLink>
      )}
    </div>
  );
}
