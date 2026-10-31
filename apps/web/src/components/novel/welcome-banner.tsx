import { InkArt } from "@/components/ui/ink-art";

/** Banner trang chủ khi chưa đọc truyện nào. */
export function WelcomeBanner() {
  return (
    <section className="relative h-44 overflow-hidden rounded-card border border-line bg-subtle p-5">
      <InkArt name="home-banner" position="right" className="absolute inset-y-2 right-0 w-[78%]" />
      {/* Chữ chỉ chiếm phần trái: tranh để trống 40% bên trái nên hai lớp không chồng lên nhau. */}
      <div className="relative max-w-[58%] lg:max-w-[40ch]">
        <h2 className="font-serif text-2xl leading-tight font-bold text-fg">Thư viện đêm</h2>
        <p className="mt-2 text-sm text-fg-2">Chọn một truyện bên dưới để bắt đầu. Tiến độ đọc được lưu tự động.</p>
      </div>
    </section>
  );
}
