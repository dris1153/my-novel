import { notFound } from "next/navigation";

import { ReaderShell } from "@/components/reader/reader-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { fetchChapter } from "@/lib/queries";
import { chapterJsonLd } from "@/lib/seo";

export const revalidate = 3600;

function parseNumber(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? n : null;
}

export async function generateMetadata({ params }: PageProps<"/truyen/[slug]/chuong/[so]">) {
  const { slug, so } = await params;
  const number = parseNumber(so);
  if (number === null) return { title: "Chương" };

  const data = await fetchChapter(slug, number);
  if (!data) return { title: "Không tìm thấy chương" };

  const title = `Chương ${number}: ${data.chapter.title}`;
  const description = data.chapter.content.slice(0, 160);

  return {
    title: `${title} — ${data.novel.title}`,
    description,
    alternates: { canonical: `/truyen/${slug}/chuong/${number}` },
    openGraph: { title, description, type: "article" },
  };
}

export default async function ChapterPage({ params }: PageProps<"/truyen/[slug]/chuong/[so]">) {
  const { slug, so } = await params;
  const number = parseNumber(so);
  if (number === null) notFound();

  const data = await fetchChapter(slug, number);
  if (!data) notFound();

  const paragraphs = data.chapter.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <JsonLd
        data={chapterJsonLd({
          novelTitle: data.novel.title,
          novelSlug: data.novel.slug,
          number: data.chapter.number,
          title: data.chapter.title,
        })}
      />
      <ReaderShell
        novelId={data.novel.id}
        novelSlug={data.novel.slug}
        novelTitle={data.novel.title}
        chapterId={data.chapter.id}
        chapterNumber={data.chapter.number}
        chapterTitle={data.chapter.title}
        total={data.total}
        hasPrev={data.hasPrev}
        hasNext={data.hasNext}>
        {paragraphs.map((paragraph, index) => (
          <p key={index} style={{ marginBottom: "1em" }}>
            {paragraph}
          </p>
        ))}
      </ReaderShell>
    </>
  );
}
