import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import full from "@/assets/shortcuts/full.webp";
import genres from "@/assets/shortcuts/genres.webp";
import library from "@/assets/shortcuts/library.webp";
import newIcon from "@/assets/shortcuts/new.webp";
import reading from "@/assets/shortcuts/reading.webp";
import search from "@/assets/shortcuts/search.webp";
import { cn } from "@/lib/cn";

const SHORTCUTS: { href: string; label: string; icon: StaticImageData }[] = [
  { href: "/danh-sach/moi-cap-nhat", label: "Mới cập nhật", icon: newIcon },
  { href: "/danh-sach/hoan-thanh", label: "Truyện full", icon: full },
  { href: "/the-loai", label: "Thể loại", icon: genres },
  { href: "/tu-truyen?tab=dang-doc", label: "Đang đọc", icon: reading },
  { href: "/tu-truyen?tab=theo-doi", label: "Tủ truyện", icon: library },
  { href: "/tim-kiem", label: "Tìm kiếm", icon: search },
];

/** Lưới 6 lối tắt có icon màu (Fluent Emoji, MIT) — chỉ trên điện thoại; màn rộng đã có thanh nav. */
export function ShortcutGrid({ className }: { className?: string }) {
  return (
    <nav aria-label="Lối tắt" className={cn("grid grid-cols-3 gap-2", className)}>
      {SHORTCUTS.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className="flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-card bg-surface text-[13px] font-medium text-fg hover:bg-hover">
          {/* Icon tĩnh trong /_next/static nên không cần tối ưu lại. */}
          <Image src={icon} alt="" width={36} height={36} unoptimized />
          {label}
        </Link>
      ))}
    </nav>
  );
}
