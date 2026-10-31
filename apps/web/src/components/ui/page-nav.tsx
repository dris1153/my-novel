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
    <nav className="mt-8 flex items-center justify-center gap-4" aria-label="Phân trang">
      {page > 1 && (
        <ButtonLink variant="secondary" href={hrefFor(page - 1)}>
          ‹ Trang trước
        </ButtonLink>
      )}
      <span className="text-sm font-semibold text-fg">Trang {page}</span>
      {hasMore && <ButtonLink href={hrefFor(page + 1)}>Trang sau ›</ButtonLink>}
    </nav>
  );
}

/** Số trang trong `/trang/N`: chỉ nhận số nguyên ≥2 (trang 1 là URL gốc) — sai thì `null` để trang gọi `notFound()`. */
export function parsePageParam(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 2 ? n : null;
}

/** Trang 1 là URL gốc, các trang sau nằm dưới `/trang/N`. */
export function pagedHref(base: string, page: number) {
  return page <= 1 ? base : `${base}/trang/${page}`;
}
