import { EmptyState } from "@/components/ui/empty-state";

export function GenreEmpty() {
  return (
    <EmptyState
      art="no-results"
      title="Chưa có truyện nào"
      description="Thể loại này chưa có truyện. Thử thể loại khác nhé."
      action={{ href: "/the-loai", label: "Xem thể loại khác" }}
    />
  );
}
