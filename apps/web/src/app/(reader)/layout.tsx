import { Literata } from "next/font/google";

// Font thân truyện chỉ cần ở trang đọc; nạp ở đây để các trang khác không tải thêm.
const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600"],
  display: "swap",
});

export default function ReaderLayout({ children }: { children: React.ReactNode }) {
  return <div className={literata.variable}>{children}</div>;
}
