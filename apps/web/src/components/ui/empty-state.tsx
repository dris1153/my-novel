import { ButtonLink } from "@/components/ui/button";
import { Illustration, type IllustrationName } from "@/components/ui/illustration";

/** Trạng thái trống trong khối trắng: tranh màu + tiêu đề + mô tả + hành động. */
export function EmptyState({
  art,
  title,
  description,
  action,
}: {
  art: IllustrationName;
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mt-4 flex flex-col items-center rounded-card bg-surface px-6 py-10 text-center" data-art={art}>
      <Illustration name={art} />
      <p className="mt-4 font-heading text-xl font-bold text-fg">{title}</p>
      {description && <p className="mt-2 max-w-[40ch] text-sm text-fg-2">{description}</p>}
      {action && (
        <ButtonLink href={action.href} className="mt-6">
          {action.label}
        </ButtonLink>
      )}
    </div>
  );
}
