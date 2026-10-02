export const SITE_NAME = "Truyện";
export const SITE_DESCRIPTION = "Đọc truyện chữ online: tiên hiệp, kiếm hiệp, ngôn tình, trinh thám.";

/** URL công khai cho canonical/sitemap/OG. Vercel tự set VERCEL_URL khi deploy. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

/** JSON-LD cho trang truyện. */
export function bookJsonLd(book: {
  title: string;
  author: string;
  slug: string;
  description?: string | null;
  coverUrl?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: book.author },
    url: absoluteUrl(`/truyen/${book.slug}`),
    inLanguage: "vi",
    ...(book.description ? { description: book.description.slice(0, 500) } : {}),
    ...(book.coverUrl ? { image: book.coverUrl } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Gắn chương vào truyện — Google hiểu quan hệ cha/con. */
export function chapterJsonLd(chapter: {
  novelTitle: string;
  novelSlug: string;
  number: number;
  title: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Chapter",
    name: `Chương ${chapter.number}: ${chapter.title}`,
    position: chapter.number,
    inLanguage: "vi",
    url: absoluteUrl(`/truyen/${chapter.novelSlug}/chuong/${chapter.number}`),
    isPartOf: {
      "@type": "Book",
      name: chapter.novelTitle,
      url: absoluteUrl(`/truyen/${chapter.novelSlug}`),
    },
  };
}
