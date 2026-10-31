import { ButtonLink } from "@/components/ui/button";
import { InkScene } from "@/components/ui/ink-scene";

export type EmptyArt = "empty-library" | "no-results" | "no-chapters" | "not-found" | "error";

/** Trạng thái trống có minh hoạ. Ảnh thủy mặc thật nối vào ở phase art; tạm dùng dãy núi phác. */
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
      <InkScene className="h-24 w-44" />
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
