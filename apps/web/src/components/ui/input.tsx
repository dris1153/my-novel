import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

const INPUT =
  "w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-3 focus:border-sepia";

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(INPUT, className)} {...rest} />;
}

export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-ink-2">
      {children}
    </label>
  );
}
