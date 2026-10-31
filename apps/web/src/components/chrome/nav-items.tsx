const ICON = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function HomeIcon() {
  return (
    <svg {...ICON}>
      <path d="M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4z" />
    </svg>
  );
}

export function GridIcon() {
  return (
    <svg {...ICON}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function BookmarkIcon() {
  return (
    <svg {...ICON}>
      <path d="M6 4h12v16l-6-4-6 4z" />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg {...ICON}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg {...ICON}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export const NAV = [
  { href: "/", label: "Trang chủ", Icon: HomeIcon },
  { href: "/the-loai", label: "Thể loại", Icon: GridIcon },
  { href: "/tu-truyen", label: "Tủ truyện", Icon: BookmarkIcon },
  { href: "/toi", label: "Tôi", Icon: UserIcon },
] as const;

/** Thanh nav slate trên màn rộng — có thêm 2 danh sách vì không bị giới hạn 4 ô như tab bar. */
export const DESKTOP_NAV = [
  { href: "/", label: "Trang chủ" },
  { href: "/the-loai", label: "Thể loại" },
  { href: "/danh-sach/moi-cap-nhat", label: "Mới cập nhật" },
  { href: "/danh-sach/hoan-thanh", label: "Truyện full" },
  { href: "/tu-truyen", label: "Tủ truyện" },
] as const;

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
