import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { InkScene } from "@/components/ui/ink-scene";
import { signInWithGoogle } from "@/lib/actions";
import { isAllowedEmail } from "@/lib/identity";

export const metadata = {
  title: "Đăng nhập",
  robots: { index: false, follow: false },
};

export default async function SignInPage({ searchParams }: PageProps<"/dang-nhap">) {
  const session = await auth();
  if (session?.user?.id && isAllowedEmail(session.user.email)) redirect("/");

  const sp = await searchParams;
  const from = typeof sp.from === "string" ? sp.from : "";
  const denied = sp.error === "AccessDenied";

  return (
    <main className="mx-auto flex w-full max-w-[420px] flex-col px-6 pt-10">
      <InkScene className="h-44 w-full" />

      <h1 className="mt-6 text-center font-serif text-3xl font-bold text-fg">Thư viện đêm</h1>
      <p className="mt-2 text-center text-sm text-fg-2">
        Nơi đọc truyện riêng cho vài người quen. Đăng nhập để đọc và lưu tiến độ.
      </p>

      {denied && (
        <p role="alert" className="mt-6 rounded-xl border border-line bg-surface px-4 py-3 text-center text-sm text-accent-fg">
          Email này chưa được cấp quyền truy cập.
        </p>
      )}

      <form action={signInWithGoogle} className="mt-8">
        <input type="hidden" name="from" value={from} />
        <Button type="submit" className="min-h-12 w-full text-[15px]">
          <svg aria-hidden width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor" d="M21.35 11.1H12v2.98h5.35c-.23 1.26-.95 2.33-2.02 3.04v2.52h3.26c1.91-1.76 3.01-4.35 3.01-7.43 0-.72-.06-1.41-.18-2.08z" />
            <path fill="currentColor" opacity=".75" d="M12 22c2.73 0 5.02-.9 6.69-2.45l-3.26-2.52c-.9.6-2.06.96-3.43.96-2.64 0-4.87-1.78-5.67-4.18H2.96v2.6A10 10 0 0 0 12 22z" />
            <path fill="currentColor" opacity=".55" d="M6.33 13.81A6 6 0 0 1 6 12c0-.63.11-1.24.33-1.81V7.59H2.96A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.41l3.26-2.6z" />
            <path fill="currentColor" opacity=".9" d="M12 5.98c1.49 0 2.82.51 3.87 1.52l2.9-2.9C17.02 2.97 14.73 2 12 2a10 10 0 0 0-9.04 5.59l3.37 2.6C7.13 7.76 9.36 5.98 12 5.98z" />
          </svg>
          Đăng nhập bằng Google
        </Button>
      </form>
    </main>
  );
}
