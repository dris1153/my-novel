"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { NovelCover } from "@/components/novel/novel-cover";
import { cn } from "@/lib/cn";

export type HeroSlide = {
  slug: string;
  title: string;
  author: string;
  genre: string | null;
  coverUrl: string | null;
  coverColor?: string | null;
  banner: string;
};

const INTERVAL_MS = 5000;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Carousel banner: cuộn snap thuần CSS (vuốt được), chấm điều khiển, tự chạy 5s.
 * Dừng khi rê chuột / focus bên trong / tab ẩn; vuốt tay hoặc nút dừng thì dừng hẳn (WCAG 2.2.2).
 * Không tự chạy với prefers-reduced-motion.
 */
export function HeroCarousel({ slides, className }: { slides: HeroSlide[]; className?: string }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [stopped, setStopped] = useState(false);

  const goTo = (target: number) => {
    const list = listRef.current;
    list?.scrollTo({ left: target * list.clientWidth, behavior: reducedMotion() ? "auto" : "smooth" });
  };

  // `index` trong deps: đổi slide (tay hay tự động) thì đếm lại từ đầu, không nhảy ngay sau khi vuốt.
  useEffect(() => {
    if (slides.length < 2 || hovered || focused || stopped || reducedMotion()) return;
    const timer = setInterval(() => {
      const list = listRef.current;
      if (!list || document.hidden) return;
      list.scrollTo({ left: ((index + 1) % slides.length) * list.clientWidth, behavior: "smooth" });
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [slides.length, hovered, focused, stopped, index]);

  if (slides.length === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Truyện nổi bật"
      className={cn("relative overflow-hidden rounded-card bg-bar [--focus-offset:-3px] [--focus-ring:var(--on-bar)]", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}>
      <ul
        ref={listRef}
        onPointerDown={() => setStopped(true)}
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
        {slides.map((slide, i) => (
          <li
            key={slide.slug}
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${slides.length}`}
            className="relative aspect-video w-full shrink-0 snap-start">
            <Link href={`/truyen/${slide.slug}`} className="absolute inset-0 block">
              <Image
                src={slide.banner}
                alt=""
                fill
                sizes="(min-width:1024px) 640px, 100vw"
                priority={i === 0}
                // Ảnh art đã nén sẵn; `/_next/image` cũng nằm sau cổng đăng nhập.
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-4 pb-8 lg:p-5 lg:pb-9">
                <div className="w-14 shrink-0 lg:w-20">
                  <NovelCover
                    uri={slide.coverUrl}
                    title={slide.title}
                    seed={slide.slug}
                    color={slide.coverColor}
                    sizes="80px"
                  />
                </div>
                {/* Chữ đè lên tranh luôn trắng trên lớp phủ đen, không theo theme. */}
                <div className="min-w-0 text-white">
                  <p className="line-clamp-2 font-heading text-xl leading-snug font-bold lg:text-2xl">{slide.title}</p>
                  <p className="mt-0.5 truncate text-[13px] text-white/85">
                    {slide.author}
                    {slide.genre && ` · ${slide.genre}`}
                  </p>
                  <span className="mt-2 inline-flex rounded-control bg-accent px-3 py-1.5 text-[13px] font-semibold text-on-accent">
                    Đọc ngay
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {slides.length > 1 && (
        // Hàng điều khiển không chặn click vào phần banner hai bên.
        <div className="pointer-events-none absolute inset-x-0 bottom-1 flex items-center justify-center gap-0.5">
          {slides.map((slide, i) => (
            <button
              key={slide.slug}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Xem banner ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className="pointer-events-auto grid size-6 place-items-center">
              <span className={cn("h-1.5 rounded-full transition-all", i === index ? "w-4 bg-white" : "w-1.5 bg-white/50")} />
            </button>
          ))}
          <button
            type="button"
            onClick={() => setStopped((value) => !value)}
            aria-label={stopped ? "Tự chuyển banner" : "Dừng tự chuyển banner"}
            className="pointer-events-auto ml-1 grid size-6 place-items-center text-white/85">
            <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              {stopped ? <path d="M3 1.5v9l7.5-4.5z" /> : <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" />}
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
