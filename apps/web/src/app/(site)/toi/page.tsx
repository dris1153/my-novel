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
    <main className="mx-auto w-full max-w-[560px] px-4 pt-6 lg:pt-10">
      <section className="flex items-center gap-4 rounded-card border border-line bg-surface p-4">
        <span
          aria-hidden
          className="grid size-14 shrink-0 place-items-center rounded-full bg-accent-soft font-serif text-2xl font-bold text-accent-fg">
          {name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h1 className="truncate font-serif text-xl font-semibold text-fg">{name}</h1>
          <p className="truncate text-sm text-fg-2">{user.email}</p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-fg-2">Giao diện</h2>
        <ThemePicker />
        <p className="mt-2 text-xs text-fg-3">Nền đọc truyện chỉnh riêng trong trình đọc (nút Aa).</p>
      </section>

      <form action={signOutAction} className="mt-10">
        <Button type="submit" variant="ghost" className="w-full">
          Đăng xuất
        </Button>
      </form>
    </main>
  );
}
