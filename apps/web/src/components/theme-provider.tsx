"use client";

import { ThemeProvider as NextThemes } from "next-themes";
import type { ReactNode } from "react";

/**
 * `attribute="class"` để khớp `@custom-variant dark` trong globals.css. Mặc định light (light-first).
 * `disableTransitionOnChange` tránh nháy transition toàn trang khi đổi theme.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
    </NextThemes>
  );
}
