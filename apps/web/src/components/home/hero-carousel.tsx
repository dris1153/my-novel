"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

const SLIDES = [
  {
    badge: "Đọc ngay",
    title: "Khám phá thế giới truyện bất tận!",
    text: "Những câu chuyện hay nhất, luôn ở đây dành cho bạn.",
    cta: "Bắt đầu đọc",
    href: "/danh-sach/moi-cap-nhat",
    art: "/art/hero-1.webp",
  },
  {
    badge: "Truyện full",
    title: "Cả bộ trọn vẹn, đọc một mạch!",
    text: "Những truyện đã hoàn thành, không phải chờ chương mới.",
    cta: "Xem truyện full",
    href: "/danh-sach/hoan-thanh",
    art: "/art/hero-2.webp",
  },
  {
    badge: "Thể loại",
    title: "Hôm nay bạn muốn đọc gì?",
    text: "Tiên hiệp, kiếm hiệp, huyền huyễn… chọn đúng tâm trạng của bạn.",
    cta: "Chọn thể loại",
    href: "/the-loai",
    art: "/art/hero-3.webp",
  },
];

const INTERVAL_MS = 5000;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ROUND = "pointer-events-auto hidden size-11 place-items-center rounded-full bg-surface/80 text-fg hover:bg-surface sm:grid";
const CHEVRON = {
  "aria-hidden": true,
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * Carousel banner: cuộn snap thuần CSS (vuốt được), mũi tên + chấm, tự chạy 5s.
 * Dừng khi rê chuột / focus bên trong / tab ẩn; vuốt tay hoặc nút dừng thì dừng hẳn (WCAG 2.2.2).
 * Không tự chạy với prefers-reduced-motion.
 */
export function HeroCarousel({ className }: { className?: string }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [stopped, setStopped] = useState(false);

  const goTo = (target: number) => {
    const list = listRef.current;
    const wrapped = (target + SLIDES.length) % SLIDES.length;
    list?.scrollTo({ left: wrapped * list.clientWidth, behavior: reducedMotion() ? "auto" : "smooth" });
  };

  // `index` trong deps: đổi slide (tay hay tự động) thì đếm lại từ đầu, không nhảy ngay sau khi vuốt.
  useEffect(() => {
    if (hovered || focused || stopped || reducedMotion()) return;
    const timer = setInterval(() => {
      const list = listRef.current;
      if (!list || document.hidden) return;
      list.scrollTo({ left: ((index + 1) % SLIDES.length) * list.clientWidth, behavior: "smooth" });
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [hovered, focused, stopped, index]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Giới thiệu"
      className={cn("relative overflow-hidden rounded-card bg-tint-lavender [--focus-offset:-3px]", className)}
      // Chỉ chuột thật và focus bàn phím: chạm/bấm mà tính vào đây thì banner kẹt ở trạng thái dừng.
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={(event) => event.target.matches(":focus-visible") && setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}>
      <ul
        ref={listRef}
        onPointerDown={() => setStopped(true)}
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto">
        {SLIDES.map((slide, i) => (
          <li
            key={slide.art}
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${SLIDES.length}`}
            className="relative aspect-[4/3] w-full shrink-0 snap-start sm:aspect-[21/9] lg:aspect-auto lg:min-h-[376px]">
            <Image
              src={slide.art}
              alt=""
              fill
              sizes="(min-width:1024px) 860px, 100vw"
              priority={i === 0}
              // Ảnh art đã nén sẵn; `/_next/image` cũng nằm sau cổng đăng nhập.
              unoptimized
              className="object-cover object-right"
            />
            {/* Phủ theo màu nền trang để chữ theo token đọc được ở cả 2 theme, trên mọi tranh. */}
            <div className="absolute inset-0 bg-gradient-to-r from-canvas/95 via-canvas/70 via-70% to-transparent to-100% sm:via-55% sm:to-85% min-[90rem]:via-50% min-[90rem]:to-70%" />
            <div className="relative flex h-full max-w-[75%] flex-col items-start justify-center gap-2 p-5 pb-9 sm:max-w-[55%] lg:gap-3 lg:p-8 min-[90rem]:max-w-[48%] min-[90rem]:p-10">
              <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-fg">{slide.badge}</span>
              <p className="font-heading text-2xl leading-tight font-extrabold text-balance text-fg lg:text-[32px] min-[90rem]:text-[40px] min-[90rem]:leading-[1.15]">
                {slide.title}
              </p>
              <p className="hidden text-[15px] font-medium text-fg sm:block">{slide.text}</p>
              <Link
                href={slide.href}
                className="mt-1 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-on-ink hover:opacity-90 [--focus-ring:var(--on-ink)]">
                {slide.cta} <span aria-hidden>→</span>
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {/* Hàng điều khiển không chặn thao tác với phần banner xung quanh. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-2 flex items-center justify-center lg:bottom-4">
        <div className="pointer-events-auto flex items-center gap-0.5 rounded-full bg-surface/80 px-1">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.art}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Xem banner ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className="grid size-6 place-items-center">
              <span className={cn("h-1.5 rounded-full transition-all", i === index ? "w-4 bg-fg" : "w-1.5 bg-fg/60")} />
            </button>
          ))}
          <button
            type="button"
            onClick={() => setStopped((value) => !value)}
            aria-label={stopped ? "Tự chuyển banner" : "Dừng tự chuyển banner"}
            className="grid size-6 place-items-center text-fg motion-reduce:hidden">
            <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              {stopped ? <path d="M3 1.5v9l7.5-4.5z" /> : <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" />}
            </svg>
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute right-4 bottom-3 flex gap-2">
        <button type="button" onClick={() => goTo(index - 1)} aria-label="Banner trước" className={ROUND}>
          <svg {...CHEVRON}>
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button type="button" onClick={() => goTo(index + 1)} aria-label="Banner sau" className={ROUND}>
          <svg {...CHEVRON}>
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
