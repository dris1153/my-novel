"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

const PARTICLES = Array.from({ length: 8 });

/** Vector + thời lượng lệch nhau chút cho tia bắn trông tự nhiên. */
function particleStyle(index: number) {
  const angle = (index / PARTICLES.length) * Math.PI * 2;
  return {
    "--px": `${Math.round(Math.cos(angle) * 20)}px`,
    "--py": `${Math.round(Math.sin(angle) * 20)}px`,
    "--pdur": `${520 + (index % 3) * 40}ms`,
    "--pdelay": `${index * 12}ms`,
    "--p-end-scale": `${0.5 + (index % 3) * 0.15}`,
    "--psize": `${0.8 + (index % 3) * 0.25}`,
  } as React.CSSProperties;
}

/**
 * Like button — CSS nguyên từ skill transitions-dev (23-like-button).
 * Trạng thái do caller giữ; ở đây chỉ lo phần "ăn mừng" khi vừa thích.
 */
export function LikeButton({
  liked,
  onToggle,
  labelOn,
  labelOff,
  disabled,
  className,
}: {
  liked: boolean;
  onToggle: (next: boolean) => void;
  labelOn: string;
  labelOff: string;
  disabled?: boolean;
  className?: string;
}) {
  const [bursting, setBursting] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    []
  );

  function handleClick() {
    const next = !liked;
    onToggle(next);
    if (!next) return;

    // Hạ rồi bật lại trong frame sau để bấm liên tiếp vẫn replay được.
    setBursting(false);
    requestAnimationFrame(() => setBursting(true));
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setBursting(false), 700);
  }

  return (
    <button
      type="button"
      data-liked={liked}
      aria-pressed={liked}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "t-like relative inline-flex items-center gap-2 rounded-lg border border-ash px-4 py-2 text-sm leading-none text-ink transition-colors hover:border-ink disabled:opacity-60",
        bursting && "is-bursting",
        className
      )}>
      <span className="t-like-icon inline-flex">
        <svg
          className="t-like-heart"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden>
          <path d="M12 20.4s-7.2-4.4-7.2-9.7A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.2 3.1c0 5.3-7.2 9.7-7.2 9.7z" />
        </svg>
      </span>

      <span className="t-like-particles" aria-hidden>
        {PARTICLES.map((_, index) => (
          <i key={index} style={particleStyle(index)} />
        ))}
      </span>

      <span>{liked ? labelOn : labelOff}</span>
    </button>
  );
}
