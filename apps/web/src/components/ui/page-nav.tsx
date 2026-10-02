import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";

/**
 * Phân trang theo route (không dùng `?page=`) để mỗi trang vẫn tĩnh/ISR và
 * crawler đi được. Không đếm tổng số trang — chỉ cần biết còn trang sau không.
 */
export function PageNav({
  page,
  hasMore,
  hrefFor,
}: {
  page: number;
  hasMore: boolean;
  hrefFor: (page: number) => string;
}) {
  if (page <= 1 && !hasMore) return null;

  return (
    <nav className="mt-10 flex items-center justify-between gap-4" aria-label="Phân trang">
      {page > 1 ? (
        <ButtonLink variant="ghost" href={hrefFor(page - 1)}>
          ‹ Trang trước
        </ButtonLink>
      ) : (
        <span />
      )}

      <span className="text-sm text-ink-3">Trang {page}</span>

      {hasMore ? (
        <ButtonLink variant="ghost" href={hrefFor(page + 1)}>
          Trang sau ›
        </ButtonLink>
      ) : (
        <span />
      )}
    </nav>
  );
}

/** Trang 1 là URL gốc, các trang sau nằm dưới `/trang/N`. */
export function pagedHref(base: string, page: number) {
  return page <= 1 ? base : `${base}/trang/${page}`;
}

export function PageCrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-xs text-ink-3">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden>›</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink-2">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
