import { NovelForm } from "@/components/novel-form";
import { requireAdmin } from "@/lib/auth";

export default async function NewNovelPage() {
  const { supabase } = await requireAdmin();
  const { data: genres } = await supabase.from("genres").select("id, slug, name").order("name");

  return (
    <>
      <h1 className="mb-5 font-serif text-2xl tracking-tight">Thêm truyện mới</h1>
      <NovelForm genres={genres ?? []} />
    </>
  );
}
