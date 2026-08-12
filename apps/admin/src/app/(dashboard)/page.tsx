import Link from "next/link";
import { NOVEL_STATUS_LABEL, timeAgo } from "shared";

import { requireAdmin } from "@/lib/auth";

export default async function NovelsPage() {
  const { supabase } = await requireAdmin();

  const { data: novels, error } = await supabase
    .from("novels")
    .select("id, title, author, status, published, updated_at, cover_url, chapters(count)")
    .order("updated_at", { ascending: false });

  const drafts = (novels ?? []).filter((n) => !n.published).length;

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl tracking-tight">Truyện</h1>
          <p className="text-sm text-ink-2">
            {novels?.length ?? 0} truyện · {drafts} bản nháp
          </p>
        </div>
        <Link
          href="/novels/new"
          className="rounded-lg bg-sienna px-4 py-2.5 text-sm font-semibold text-white"
        >
          + Thêm truyện
        </Link>
      </div>

      {error && <p className="text-sm text-sienna">{error.message}</p>}

      {novels?.length === 0 && (
        <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-ink-2">
          Chưa có truyện nào. Bấm “Thêm truyện” để bắt đầu.
        </p>
      )}

      {novels && novels.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[11px] tracking-wider text-ink-3 uppercase">
                <th className="px-3 py-2.5 font-semibold">Tên truyện</th>
                <th className="px-3 py-2.5 font-semibold">Tác giả</th>
                <th className="px-3 py-2.5 font-semibold">Chương</th>
                <th className="px-3 py-2.5 font-semibold">Trạng thái</th>
                <th className="px-3 py-2.5 font-semibold">Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {novels.map((n) => (
                <tr key={n.id} className="border-b border-line last:border-0">
                  <td className="px-3 py-2.5">
                    <Link href={`/novels/${n.id}`} className="font-semibold hover:text-sienna">
                      {n.title}
                    </Link>
                    <span className="ml-2 text-xs text-ink-3">
                      {NOVEL_STATUS_LABEL[n.status]}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-ink-2">{n.author}</td>
                  <td className="px-3 py-2.5 text-ink-2">{n.chapters?.[0]?.count ?? 0}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        n.published ? "bg-ok-soft text-ok" : "bg-raised text-ink-3"
                      }`}
                    >
                      {n.published ? "Đã đăng" : "Nháp"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-ink-3">{timeAgo(n.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
