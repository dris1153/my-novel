---
phase: 9
title: "SEO"
status: done
priority: P1
effort: "0.5d"
dependencies: [4, 5, 6, 7]
---

# Phase 9: SEO

## Overview

Giải hẳn hạn chế SEO của Expo web: mỗi trang có metadata + HTML nội dung thật, JSON-LD,
sitemap, robots, OG image.

## Related Code Files

- Create: `apps/web/src/lib/seo.ts`
- Create: `apps/web/src/app/sitemap.ts`, `robots.ts`
- Create: `apps/web/src/app/opengraph-image.tsx` (và per-route nếu cần)
- Modify: các page thêm `generateMetadata`

## Steps

1. `generateMetadata` cho home/thể loại/truyện/chương; canonical.
2. JSON-LD `Book` + `BreadcrumbList` ở trang truyện; chương dùng `Chapter`/`hasPart`.
3. `sitemap.ts`: home + thể loại + truyện (không đưa toàn bộ chương).
4. `robots.ts`: chặn `/tim-kiem`, `/tu-truyen`, `/toi`, trang auth.
5. OG image động (nền ivory, tiêu đề serif).
6. ISR `revalidate` cho trang public; `noindex` cho trang auth/search.

## Success Criteria

- [x] `view-source` chương có nội dung (không phải spinner)
- [x] `sitemap.xml` + `robots.txt` đúng
- [x] Không có trang auth nào bị index
