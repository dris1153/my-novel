import { NovelGridCard } from "./novel-card";

import { SectionHeading } from "@/components/ui/section-heading";
import type { NovelCard } from "@/lib/queries";

/** Khối trắng: tiêu đề vạch xanh + "Thêm →" + lưới 4 bìa/hàng (8 trên màn rộng), như kệ của TruyenYY. */
export function Shelf({
  title,
  novels,
  action,
}: {
  title: string;
  novels: NovelCard[];
  action?: { href: string; label: string };
}) {
  return (
    <section className="rounded-card bg-surface p-3 lg:p-5">
      <SectionHeading title={title} action={action} className="mb-2" />
      <ul className="grid grid-cols-4 gap-x-2.5 gap-y-4 lg:grid-cols-8 lg:gap-x-4">
        {novels.map((novel) => (
          <li key={novel.slug}>
            <NovelGridCard novel={novel} sizes="(min-width:1024px) 140px, 25vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
