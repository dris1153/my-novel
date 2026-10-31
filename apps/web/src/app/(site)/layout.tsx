import { Header } from "@/components/chrome/header";
import { Sidebar } from "@/components/chrome/sidebar";
import { TabBar } from "@/components/chrome/tab-bar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        {/* Chừa chỗ cho tab bar cố định ở đáy (cao 64px + vùng an toàn). */}
        <div className="flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-10">{children}</div>
        <TabBar />
      </div>
    </div>
  );
}
