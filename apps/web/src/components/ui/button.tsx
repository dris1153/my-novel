import type { ButtonHTMLAttributes } from "react";
import Link from "next/link";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "ghost" | "ghost-light";

const BASE =
  "inline-flex items-center justify-center rounded-lg text-sm leading-none transition-[filter,border-color,background-color] disabled:opacity-60";

const VARIANTS: Record<ButtonVariant, string> = {
  /** CTA duy nhất của brand — sepia đậm lên nhẹ khi hover, không shadow. */
  primary: "bg-sepia px-4 py-2 text-on-sepia hover:brightness-95",
  ghost: "border border-ash px-4 py-2 text-ink hover:border-ink",
  /** Ghost đặt trên panel ink-violet: viền sáng mảnh, chữ ivory. */
  "ghost-light":
    "border border-[rgba(255,253,248,0.4)] px-4 py-2 text-on-violet hover:border-[rgba(255,253,248,0.8)]",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant };

export function Button({ variant = "primary", className, ...rest }: Props) {
  return <button className={cn(BASE, VARIANTS[variant], className)} {...rest} />;
}

/** Bản link của Button — dùng cho CTA điều hướng. */
export function ButtonLink({
  variant = "primary",
  className,
  href,
  children,
}: {
  variant?: ButtonVariant;
  className?: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cn(BASE, VARIANTS[variant], className)}>
      {children}
    </Link>
  );
}
