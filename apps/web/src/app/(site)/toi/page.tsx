import { ThemePicker } from "@/components/chrome/theme-picker";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions";
import { requireUser } from "@/lib/auth";

export const metadata = {
  title: "Tài khoản",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const { user } = await requireUser();
  const name = user.name ?? user.email?.split("@")[0] ?? "Bạn đọc";

  return (
    <main className="mx-auto flex w-full max-w-[560px] flex-col gap-4 px-4 pt-4 lg:pt-6">
      <section className="flex items-center gap-4 rounded-card bg-surface p-4">
        <span
          aria-hidden
          className="grid size-14 shrink-0 place-items-center rounded-full bg-accent-soft font-heading text-2xl font-bold text-accent-fg">
          {name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h1 className="truncate font-heading text-xl font-semibold text-fg">{name}</h1>
          <p className="truncate text-sm text-fg-2">{user.email}</p>
        </div>
      </section>

      <section className="rounded-card bg-surface p-4">
        <h2 className="mb-3 border-l-4 border-accent pl-2.5 font-heading text-lg font-bold text-fg">Giao diện</h2>
        <ThemePicker />
        <p className="mt-2 text-xs text-fg-3">Nền đọc truyện chỉnh riêng trong trình đọc (nút Aa).</p>
      </section>

      <form action={signOutAction} className="mt-4">
        <Button type="submit" variant="ghost" className="w-full">
          Đăng xuất
        </Button>
      </form>
    </main>
  );
}
