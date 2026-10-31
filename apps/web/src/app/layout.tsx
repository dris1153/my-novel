import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

// Nunito cho giao diện + tiêu đề. Literata (thân truyện) chỉ nạp ở (reader).
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const SITE_NAME = "Truyện";

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: "Đọc truyện chữ online.",
  robots: { index: false, follow: false },
};

// `cover` để nội dung tràn tới mép máy có tai thỏ; tab bar tự chừa `safe-area-inset-bottom`.
export const viewport: Viewport = { viewportFit: "cover", themeColor: "#fcf8f8" };

/**
 * Layout gốc chỉ lo html/body/font/theme + provider.
 * Header/tab bar nằm ở `(site)`, còn trang đọc có chrome riêng ở `(reader)`.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" suppressHydrationWarning className={nunito.variable}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
