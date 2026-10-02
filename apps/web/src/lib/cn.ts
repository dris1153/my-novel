/** Ghép class có điều kiện. Không cần clsx/tailwind-merge cho quy mô này. */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
