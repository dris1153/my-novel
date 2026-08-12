import Link from "next/link";

import { signOut } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const { profile } = await requireAdmin();

  return (
    <div className="grid min-h-dvh grid-cols-1 md:grid-cols-[220px_1fr]">
      <aside className="border-line bg-raised p-4 md:border-r">
        <div className="px-3 pb-5 font-serif text-lg">Novel Admin</div>
        <nav className="flex gap-1 md:flex-col">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-ink-2 hover:bg-line/60"
          >
            Truyện
          </Link>
          <Link
            href="/novels/new"
            className="rounded-lg px-3 py-2 text-sm font-medium text-ink-2 hover:bg-line/60"
          >
            Thêm truyện
          </Link>
        </nav>

        <form action={signOut} className="mt-6 border-t border-line pt-4">
          <p className="mb-2 px-3 text-xs text-ink-3">{profile?.display_name ?? "Admin"}</p>
          <button
            type="submit"
            className="rounded-lg px-3 py-2 text-sm font-medium text-ink-2 hover:bg-line/60"
          >
            Đăng xuất
          </button>
        </form>
      </aside>

      <main className="p-6">{children}</main>
    </div>
  );
}
