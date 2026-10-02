import { cn } from "@/lib/cn";

/** Card giấy: 1px hairline, không shadow — "giấy chồng giấy". */
export function Card({
  children,
  className,
  as: As = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "section" | "li";
}) {
  return <As className={cn("rounded-lg border border-line bg-paper p-6", className)}>{children}</As>;
}
