import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth/auth-form";
import { DoodleQuill } from "@/components/doodles";
import { signUp } from "@/lib/actions";
import { getUserOrNull } from "@/lib/current-user";

export const metadata = {
  title: "Đăng ký",
  robots: { index: false, follow: false },
};

export default async function SignUpPage() {
  if (await getUserOrNull()) redirect("/tu-truyen");

  return (
    <main className="mx-auto w-full max-w-[420px] px-6 pt-16">
      <DoodleQuill size={64} rotate={-8} className="mx-auto" />
      <h1 className="mt-6 text-center font-serif text-[32px] leading-[1.12] text-ink">
        Tạo tài khoản
      </h1>
      <p className="mt-2 mb-8 text-center text-sm text-ink-3">
        Miễn phí. Chỉ cần để lưu tủ truyện và tiến độ đọc.
      </p>

      <AuthForm mode="signup" action={signUp} />
    </main>
  );
}
