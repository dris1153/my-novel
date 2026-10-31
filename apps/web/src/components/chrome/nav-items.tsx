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

export function BookIcon() {
  return (
    <svg {...ICON}>
      <path d="M12 6.5C10.5 5 8 4.5 4 4.5v14c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-14c-4 0-6.5.5-8 2z" />
      <path d="M12 6.5v14" />
    </svg>
  );
}

export function FlameIcon() {
  return (
    <svg {...ICON}>
      <path d="M12 3c.5 3.5-4.5 6-4.5 11a4.5 4.5 0 0 0 9 0c0-2-1-3.5-2-4.5-.3 1.5-1 2.3-2 2.8.4-3.3-.2-6.8-.5-9.3z" />
    </svg>
  );
}

export function StarIcon() {
  return (
    <svg {...ICON}>
      <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" />
    </svg>
  );
}

export function GearIcon() {
  return (
    <svg {...ICON}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" />
    </svg>
  );
}

export function SunIcon() {
  return (
    <svg {...ICON}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
    </svg>
  );
}

/** Sidebar màn rộng — có thêm 2 danh sách vì không bị giới hạn 4 ô như tab bar. */
export const DESKTOP_NAV = [
  { href: "/", label: "Trang chủ", Icon: HomeIcon },
  { href: "/the-loai", label: "Thể loại", Icon: BookIcon },
  { href: "/danh-sach/moi-cap-nhat", label: "Mới cập nhật", Icon: FlameIcon },
  { href: "/danh-sach/hoan-thanh", label: "Truyện full", Icon: StarIcon },
  { href: "/tu-truyen", label: "Tủ truyện", Icon: BookmarkIcon },
] as const;

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
