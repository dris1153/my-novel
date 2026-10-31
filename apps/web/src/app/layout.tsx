import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Roboto_Condensed } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

// Be Vietnam Pro cho giao diện, Roboto Condensed cho tiêu đề/nav. Literata (thân truyện) chỉ nạp ở (reader).
const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
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
export const viewport: Viewport = { viewportFit: "cover", themeColor: "#ffffff" };

/**
 * Layout gốc chỉ lo html/body/font/theme + provider.
 * Header/tab bar nằm ở `(site)`, còn trang đọc có chrome riêng ở `(reader)`.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${beVietnam.variable} ${robotoCondensed.variable}`}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
