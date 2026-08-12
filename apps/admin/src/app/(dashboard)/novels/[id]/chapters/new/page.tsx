import { ChapterEditor } from "@/components/chapter-editor";
import { requireAdmin } from "@/lib/auth";

export default async function NewChapterPage({ params }: PageProps<"/novels/[id]/chapters/new">) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  // Gợi số chương tiếp theo = max hiện có + 1.
  const { data: last } = await supabase
    .from("chapters")
    .select("number")
    .eq("novel_id", id)
    .order("number", { ascending: false })
    .limit(1)
    .maybeSingle();

  return <ChapterEditor novelId={id} suggestedNumber={(last?.number ?? 0) + 1} />;
}
