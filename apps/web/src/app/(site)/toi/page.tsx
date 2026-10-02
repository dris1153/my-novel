import { ProfileForm } from "@/components/auth/profile-form";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions";
import { requireUser } from "@/lib/auth";

export const metadata = {
  title: "Tài khoản",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const { supabase, user } = await requireUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  return (
    <main className="mx-auto w-full max-w-[560px] px-6 pt-12">
      <h1 className="font-serif text-[32px] leading-[1.12] text-ink">Tài khoản</h1>
      <p className="mt-2 text-sm text-ink-3">{user.email}</p>

      <div className="mt-8">
        <ProfileForm initialName={profile?.display_name ?? ""} />
      </div>

      <form action={signOut} className="mt-10 border-t border-line pt-6">
        <Button type="submit" variant="ghost">
          Đăng xuất
        </Button>
      </form>
    </main>
  );
}
