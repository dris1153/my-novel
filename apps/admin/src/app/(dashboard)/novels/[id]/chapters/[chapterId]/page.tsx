import { notFound } from "next/navigation";

import { ChapterEditor } from "@/components/chapter-editor";
import { requireAdmin } from "@/lib/auth";

export default async function EditChapterPage({
  params,
}: PageProps<"/novels/[id]/chapters/[chapterId]">) {
  const { id, chapterId } = await params;
  const { supabase } = await requireAdmin();

  const { data: chapter } = await supabase
    .from("chapters")
    .select("id, number, title, content")
    .eq("id", chapterId)
    .eq("novel_id", id)
    .single();

  if (!chapter) notFound();

  return <ChapterEditor novelId={id} chapter={chapter} />;
}
