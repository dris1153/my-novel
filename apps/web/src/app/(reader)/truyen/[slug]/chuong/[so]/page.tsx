import { notFound } from "next/navigation";

import { ReaderShell } from "@/components/reader/reader-shell";
import { chapterLabel } from "@/lib/chapter-title";
import { fetchChapter } from "@/lib/queries";
import { readMyStateOrEmpty } from "@/lib/state-store";

export const revalidate = 600;

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

  const title = chapterLabel(number, data.chapter.title);
  const description = data.chapter.content.slice(0, 160);

  return {
    title: `${title} — ${data.novel.title}`,
    description,
  };
}

export default async function ChapterPage({ params }: PageProps<"/truyen/[slug]/chuong/[so]">) {
  const { slug, so } = await params;
  const number = parseNumber(so);
  if (number === null) notFound();

  const data = await fetchChapter(slug, number);
  if (!data) notFound();

  const saved = (await readMyStateOrEmpty()).progress[slug];
  const resumed = saved?.chapter === number;

  const paragraphs = data.chapter.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <ReaderShell
        novelSlug={data.novel.slug}
        novelTitle={data.novel.title}
        chapterNumber={data.chapter.number}
        chapterTitle={data.chapter.title}
        total={data.total}
        prevNumber={data.prevNumber}
        nextNumber={data.nextNumber}
        nextTitle={data.nextTitle}
        initialScroll={resumed ? saved.scroll : 0}
        alreadySaved={resumed}>
        {paragraphs.map((paragraph, index) => (
          <p key={index} style={{ marginBottom: "1em" }}>
            {paragraph}
          </p>
        ))}
      </ReaderShell>
    </>
  );
}
