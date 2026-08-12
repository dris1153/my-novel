---
phase: 1
title: "Mobile re-tokenize"
status: pending
priority: P1
effort: "4h"
dependencies: []
---

# Phase 1: Mobile re-tokenize

## Overview

Đổi `Colors.light` + font sang Opennote trong app mobile, thêm role serif cho tiêu đề, đổi
hero sienna → ink-violet panel. Reader, `Colors.dark`, `ReadingThemes` KHÔNG đụng tới.

## Requirements

- Functional: chrome (home, chi tiết, tìm kiếm, tủ truyện, tab bar) mang palette + font Opennote.
- Non-functional: reader + dark mode + 4 reading theme bất biến. Render tiếng Việt đúng.

## Architecture

Token flow: components đọc màu qua `useTheme()` → `Colors[scheme]`, font qua `FontFamily.*`.
Đổi ở nguồn token thì phần lớn component tự cập nhật. Phần tay là: (a) title element đổi
sang serif, (b) hero đổi cấu trúc.

Palette `Colors.light` mới (Opennote):
```
text #0a0a0a, textSecondary #474747, textTertiary #8c8c8c,
background #fffdf8, backgroundElement #f9f9f9, backgroundSelected #f0efe9 (nhẹ hơn),
surface #fffdf8 (cùng canvas — Opennote "giấy chồng giấy"), border #e5e5e5,
accent #512906 (sepia), accentSoft #f2ece3, gold → BỎ hoặc forest #0c3b1a cho tag,
+ thêm: violet #242d64, forest #0c3b1a
```

FontFamily mới:
```
web:  ui/uiMedium/uiSemi/uiBold → var(--font-ui)=Inter; serif/serifSemi → var(--font-serif)=Source Serif 4; read → var(--font-read)=Literata (giữ)
native: ui=Inter_400Regular, uiMedium=Inter_500Medium, uiSemi=Inter_600SemiBold, uiBold=Inter_700Bold,
        serif=SourceSerif4_400Regular, serifSemi=SourceSerif4_500Medium, read=Literata_* (giữ)
```

## Related Code Files

- Modify: `apps/mobile/src/constants/theme.ts` (Colors.light, thêm violet/forest, FontFamily, Fonts)
- Modify: `apps/mobile/src/global.css` (thêm `--font-serif`, đổi `--font-ui` sang Inter import)
- Modify: `apps/mobile/src/app/_layout.tsx` (useFonts thêm Source Serif 4 + Inter)
- Modify: `apps/mobile/package.json` (deps 2 font)
- Modify: `apps/mobile/src/components/themed-text.tsx` (linkPrimary #3c87f7 → accent; thêm variant serif nếu cần)
- Modify: `apps/mobile/src/app/truyen/[slug].tsx` (hero #2C1810 → violet #242d64; title → serif)
- Modify: `apps/mobile/src/app/(tabs)/index.tsx` (hero/feature → ink-violet panel; section title → serif)
- Modify: `apps/mobile/src/components/novel-card.tsx` (tên truyện → serif)
- Modify: `apps/mobile/src/components/novel-cover.tsx` (FALLBACKS → tông Opennote trầm; title serif)
- Modify: `apps/mobile/src/components/app-tabs.tsx` / `app-tabs.web.tsx` (nav Inter, brand có thể serif)
- NOT TOUCH: `reader-settings.tsx`, `truyen/[slug]/[chuong].tsx`, `Colors.dark`, `ReadingThemes`

## Implementation Steps

1. Cài `@expo-google-fonts/source-serif-4 @expo-google-fonts/inter` qua `npx expo install`.
2. `theme.ts`: đổi `Colors.light` sang palette Opennote; thêm `violet`, `forest`; bỏ `gold/goldSoft`
   (hoặc map gold→forest nếu component còn dùng — grep trước khi xoá). Đổi `Fonts` + `FontFamily`
   (thêm `serif`, `serifSemi`; đổi ui* sang Inter). Radius: đảm bảo `Radius.md=10`.
3. `global.css`: `--font-ui` = Inter, thêm `--font-serif` = Source Serif 4, `--font-read` giữ Literata.
   Cập nhật `@import` Google Fonts (Inter + Source Serif 4 + Literata, subset vietnamese).
4. `_layout.tsx`: `useFonts({ Inter_400/500/600/700, SourceSerif4_400/500, Literata_* giữ })`.
5. `themed-text.tsx`: `linkPrimary` bỏ `#3c87f7`, dùng `theme.accent`. Cân nhắc thêm `type="title"`
   dùng `FontFamily.serif`.
6. Đổi TITLE element sang serif: tên truyện (card + row + detail hero), section heading
   ("Mới cập nhật"/"Nổi bật"), screen title ("Đọc tiếp"/"Tủ truyện"). Meta/nav/button giữ Inter.
7. Hero: `[slug].tsx` `#2C1810` → `#242d64` (ink-violet), giữ chữ trắng. Home hero/feature → panel
   ink-violet như demo (band "Đề cử"). Chỉ MỘT panel/màn.
8. `novel-cover.tsx` FALLBACKS → tông trầm Opennote (demo dùng #5b4636/#2f3a52/#4a3c5c/#38503a/#6b5330/#4b3040).
9. `pnpm --filter mobile typecheck` + grep `gold`/`#3c87f7` = rỗng.

## Success Criteria

- [ ] `Colors.dark` và `ReadingThemes` diff = 0 dòng
- [ ] `reader-settings.tsx` + `[chuong].tsx` diff = 0 dòng (reader bất biến)
- [ ] Tên truyện + section heading render bằng Source Serif 4; nav/button/meta bằng Inter
- [ ] Hero chi tiết + home dùng ink-violet #242d64, không còn #2C1810
- [ ] Không còn `#3c87f7`, không margin-yellow trên chrome
- [ ] `pnpm --filter mobile typecheck` sạch

## Risk Assessment

- Bỏ `gold` làm vỡ component còn dùng → grep `gold`/`goldSoft` TRƯỚC, map sang forest/accent.
- Source Serif 4 hoặc Inter thiếu weight khi useFonts → dùng đúng tên export package.
- Serif ở tiêu đề tiếng Việt có thể lệch baseline với Inter meta → kiểm mắt ở phase 3.
