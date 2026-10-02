import type { MetadataRoute } from "next";

import { fetchAllNovelPaths, fetchGenres } from "@/lib/queries";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

/** Chỉ home + thể loại + truyện. Chương để crawler tự đi theo link (sitemap sẽ phình). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [genres, novels] = await Promise.all([fetchGenres(), fetchAllNovelPaths()]);

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/the-loai`, changeFrequency: "weekly", priority: 0.6 },
    ...genres.map((genre) => ({
      url: `${SITE_URL}/the-loai/${genre.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...novels.map((novel) => ({
      url: `${SITE_URL}/truyen/${novel.slug}`,
      lastModified: new Date(novel.updated_at),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
