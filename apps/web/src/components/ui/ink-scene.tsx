import { cn } from "@/lib/cn";

/**
 * Minh hoạ tạm: dãy núi + trăng phác bằng SVG, tô theo màu chữ phụ nên hợp cả dark/light.
 * Chỗ duy nhất cần đổi khi có bộ ảnh thủy mặc thật (phase art của plan UI revamp).
 */
export function InkScene({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 360 176"
      preserveAspectRatio="xMidYMax meet"
      className={cn("text-fg-3", className)}>
      <circle cx="292" cy="40" r="16" fill="currentColor" opacity="0.22" />
      <path d="M0 120 L70 74 L118 104 L178 56 L240 110 L290 80 L360 126 V176 H0Z" fill="currentColor" opacity="0.12" />
      <path d="M0 146 L60 116 L132 142 L198 100 L264 138 L320 112 L360 136 V176 H0Z" fill="currentColor" opacity="0.22" />
    </svg>
  );
}
