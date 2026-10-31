import { ButtonLink } from "@/components/ui/button";

/** Tên người dùng trên header màn rộng; điện thoại đã có tab "Tôi". */
export function AuthSlot({ name }: { name: string }) {
  return (
    <div className="hidden lg:block">
      <ButtonLink variant="ghost" href="/toi" className="max-w-[180px]">
        <span className="truncate">{name}</span>
      </ButtonLink>
    </div>
  );
}
