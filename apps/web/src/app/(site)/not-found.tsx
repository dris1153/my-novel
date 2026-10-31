import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-[560px] px-4 pt-6">
      <EmptyState
        art="not-found"
        title="Đường này không dẫn tới đâu"
        description="Trang bạn tìm không tồn tại, hoặc truyện/chương đã bị gỡ."
        action={{ href: "/", label: "Về trang chủ" }}
      />
    </main>
  );
}
