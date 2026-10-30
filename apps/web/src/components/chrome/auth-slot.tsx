import { auth } from "@/auth";
import { ButtonLink } from "@/components/ui/button";

export async function HeaderAuthSlot() {
  const session = await auth();
  const name = session?.user?.name ?? session?.user?.email?.split("@")[0];

  if (!name) return <ButtonLink variant="ghost" href="/dang-nhap">Đăng nhập</ButtonLink>;

  return (
    <ButtonLink variant="ghost" href="/toi" className="max-w-[160px]">
      <span className="truncate">{name}</span>
    </ButtonLink>
  );
}
