import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth/auth-form";
import { DoodleQuill } from "@/components/doodles";
import { signIn } from "@/lib/actions";
import { getUserOrNull } from "@/lib/current-user";

export const metadata = {
  title: "Đăng nhập",
  robots: { index: false, follow: false },
};

export default async function SignInPage() {
  if (await getUserOrNull()) redirect("/tu-truyen");

  return (
    <main className="mx-auto w-full max-w-[420px] px-6 pt-16">
      <DoodleQuill size={64} rotate={-8} className="mx-auto" />
      <h1 className="mt-6 text-center font-serif text-[32px] leading-[1.12] text-ink">Đăng nhập</h1>
      <p className="mt-2 mb-8 text-center text-sm text-ink-3">
        Đăng nhập để lưu truyện và ghi tiến độ đọc.
      </p>

      <AuthForm mode="signin" action={signIn} />
    </main>
  );
}
