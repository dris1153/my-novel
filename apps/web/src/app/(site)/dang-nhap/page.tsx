import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { DoodleQuill } from "@/components/doodles";
import { Button } from "@/components/ui/button";
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
    <main className="mx-auto w-full max-w-[420px] px-6 pt-16">
      <DoodleQuill size={64} rotate={-8} className="mx-auto" />
      <h1 className="mt-6 text-center font-serif text-[32px] leading-[1.12] text-ink">Đăng nhập</h1>
      <p className="mt-2 mb-8 text-center text-sm text-ink-3">
        Chỉ email được cấp quyền mới vào được. Đăng nhập để đọc và lưu tiến độ.
      </p>

      {denied && (
        <p role="alert" className="mb-6 text-center text-sm text-sepia-text">
          Email này chưa được cấp quyền truy cập.
        </p>
      )}

      <form action={signInWithGoogle} className="flex justify-center">
        <input type="hidden" name="from" value={from} />
        <Button type="submit">Đăng nhập bằng Google</Button>
      </form>
    </main>
  );
}
