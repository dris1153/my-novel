import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Marginalia: hình vẽ nét tay, không fill, xoay lệch nhẹ và float trong khoảng
 * trắng — không căn grid (DESIGN.md). Luôn `aria-hidden` vì chỉ để trang trí.
 */
function Doodle({
  children,
  size = 64,
  rotate = 0,
  wash = false,
  className,
  style,
}: {
  children: ReactNode;
  size?: number;
  rotate?: number;
  /** Wash margin-yellow phía sau — chỉ dùng cho doodle, không lên chrome. */
  wash?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none relative select-none text-ink", className)}
      style={{ width: size, height: size, transform: `rotate(${rotate}deg)`, ...style }}>
      {wash && (
        <span
          className="absolute inset-[8%] rounded-[40%] bg-margin"
          style={{ transform: "rotate(-6deg)" }}
        />
      )}
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative">
        {children}
      </svg>
    </div>
  );
}

export function DoodleBook(props: DoodleProps) {
  return (
    <Doodle {...props}>
      <path d="M32 20C26 15 16 15 10 18v26c6-3 16-3 22 2" />
      <path d="M32 20c6-5 16-5 22-2v26c-6-3-16-3-22 2" />
      <path d="M32 20v26" />
      <path d="M16 26h8M40 26h8M16 33h8M40 33h8" />
    </Doodle>
  );
}

export function DoodleQuill(props: DoodleProps) {
  return (
    <Doodle {...props}>
      <path d="M45 9C30 15 19 30 15 51" />
      <path d="M45 9c6 15 0 32-15 41" />
      <path d="M15 51l-4 5" />
      <path d="M32 22l10 4M27 31l9 4" />
    </Doodle>
  );
}

export function DoodleLetter(props: DoodleProps) {
  return (
    <Doodle {...props}>
      <path d="M11 21h42v24H11z" />
      <path d="M11 21l21 15 21-15" />
      <path d="M11 45l15-13M53 45L38 32" />
    </Doodle>
  );
}

export function DoodleCompass(props: DoodleProps) {
  return (
    <Doodle {...props}>
      <circle cx="32" cy="32" r="20" />
      <path d="M32 16l7 23-7-6-7 6z" />
      <circle cx="32" cy="32" r="1.6" />
      <path d="M32 8v3M32 53v3M8 32h3M53 32h3" />
    </Doodle>
  );
}

export function DoodleLantern(props: DoodleProps) {
  return (
    <Doodle {...props}>
      <path d="M26 55l3-31h6l3 31z" />
      <path d="M22 55h20" />
      <path d="M29 24h6l2-6h-10z" />
      <path d="M35 20l9-6M29 20l-9-6M32 18v-9" />
    </Doodle>
  );
}

export function DoodleBoat(props: DoodleProps) {
  return (
    <Doodle {...props}>
      <path d="M13 40h38l-6 10H19z" />
      <path d="M32 40V19" />
      <path d="M32 20l12 15H32z" />
      <path d="M9 55c5-3 10 3 15 0s10 3 15 0 10 3 15 0" />
    </Doodle>
  );
}

type DoodleProps = {
  size?: number;
  rotate?: number;
  wash?: boolean;
  className?: string;
  style?: CSSProperties;
};
