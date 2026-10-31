import { InkScene } from "@/components/ui/ink-scene";

/** Banner trang chủ khi chưa đọc truyện nào. */
export function WelcomeBanner() {
  return (
    <section className="relative h-44 overflow-hidden rounded-card border border-line bg-subtle p-5">
      <InkScene className="absolute inset-x-0 bottom-0 h-full w-full" />
      <div className="relative max-w-[26ch]">
        <h2 className="font-serif text-2xl leading-tight font-bold text-fg">Thư viện đêm</h2>
        <p className="mt-2 text-sm text-fg-2">Chọn một truyện bên dưới để bắt đầu. Tiến độ đọc được lưu tự động.</p>
      </div>
    </section>
  );
}
