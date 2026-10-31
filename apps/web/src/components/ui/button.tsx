import type { ButtonHTMLAttributes } from "react";
import Link from "next/link";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "tonal" | "ghost";

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-5 text-sm font-semibold leading-none transition-[background-color,border-color,color] disabled:opacity-60";

const VARIANTS: Record<ButtonVariant, string> = {
  /** Màu nhấn duy nhất của app — chỉ cho hành động chính của màn hình. */
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  /** Nút xám đi kèm nút chính ("DS.Chương", "‹ Trước"). */
  secondary: "bg-tint-lavender text-fg hover:bg-hover",
  /** Nút phụ nằm trên thẻ pastel/tranh: sẫm hơn nền bên dưới ở cả 2 theme. */
  tonal: "bg-fg/10 text-fg hover:bg-fg/15",
  ghost: "border border-line-strong bg-surface text-fg hover:bg-hover",
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
