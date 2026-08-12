---
phase: 1
title: "Scaffold + Parser (thuần, có test)"
status: pending
priority: P1
effort: "3h"
dependencies: []
---

# Phase 1: Scaffold + Parser

## Overview

Dựng workspace `packages/crawler` và viết `parse.ts` thuần (không mạng, không I/O) bóc
metadata + link chương + nội dung từ HTML truyenfull. Test đầy đủ với HTML fixture offline.

## Requirements

- Functional: parse listing page → title, author, status, description, cover URL, genres, tổng số trang.
  parse chapter listing → mảng {number, url, title}. parse chapter page → nội dung `\n\n`-separated.
- Non-functional: thuần (input string → output object), 0 dependency mạng, test chạy offline.

## Architecture

```
packages/crawler/
├── src/
│   ├── parse.ts          # export parseListingMeta, parseChapterLinks, parseChapterContent
│   └── parse.test.ts     # node:test với fixture
├── test/fixtures/
│   ├── listing.html      # trang truyện (đã lưu, ~86KB)
│   └── chapter.html      # 1 chương (đã lưu, ~75KB)
├── package.json          # type: module, deps: shared, node-html-parser
└── tsconfig.json
```

Selector đã xác minh thật (brainstorm):
- Title: `h3.title[itemprop=name]`
- Author: `[itemprop=author]` (text)
- Status: text "Full/Hoàn thành/Đang ra" trong info block
- Description: `.desc-text` hoặc `[itemprop=description]` (kiểm lại trong fixture)
- Cover: `.book img[src]` / `[itemprop=image]`
- Genres: link `/the-loai/<slug>/` trong info block
- Tổng trang: `#total-page[value]`
- Chương: `.list-chapter a[href*="/chuong-"]`, số chương lấy từ URL `/chuong-(\d+)/`
- Nội dung: `#chapter-c` → strip script/ads, `<br>`+`</p>` → `\n\n`, giữ text (kể cả credit dịch giả)

## Related Code Files

- Create: `packages/crawler/package.json`, `tsconfig.json`
- Create: `packages/crawler/src/parse.ts`, `src/parse.test.ts`
- Create: `packages/crawler/test/fixtures/listing.html`, `chapter.html`
- Reuse: `packages/shared` (`slugify` cho genre map — dùng ở phase 2)

## Implementation Steps

1. `pnpm --filter crawler init` tương đương: tạo package.json `{ "name": "crawler", "type": "module", "private": true }`,
   scripts `test`, `typecheck`. Deps: `node-html-parser`, `shared: workspace:*`. devDep `@types/node`.
2. tsconfig kế thừa pattern `packages/shared` (module ESNext, moduleResolution bundler, allowImportingTsExtensions).
3. Lưu fixture: `curl -A "<UA>"` trang truyện + 1 chương vào `test/fixtures/` (đã có sẵn ở /tmp lúc brainstorm).
4. Viết `parse.ts`:
   - `parseListingMeta(html): { title, author, status, description, coverUrl, genreSlugs[], totalPages }`
   - `parseChapterLinks(html): { number, url, title }[]` (từ 1 trang listing)
   - `parseChapterContent(html): string` (nội dung `\n\n`-separated)
   - Map status text → enum `ongoing|completed` (Full/Hoàn thành → completed).
5. Viết `parse.test.ts` (node:test): assert title đúng "Đại Phụng Đả Canh Nhân", author, totalPages=42,
   ≥1 genre, chương page-1 có 50 link số 1..50, nội dung chương-1 chứa "Hứa Thất An" và có `\n\n`.
6. `pnpm --filter crawler test` + `typecheck` xanh.

## Success Criteria

- [ ] `pnpm --filter crawler test` pass, chạy offline (không gọi mạng)
- [ ] `parseListingMeta` trả đúng title/author/totalPages=42 từ fixture
- [ ] `parseChapterLinks` trả 50 chương từ trang listing, số 1..50
- [ ] `parseChapterContent` trả text có `\n\n` ngăn đoạn, không còn tag HTML
- [ ] `pnpm --filter crawler typecheck` sạch

## Risk Assessment

- Selector sai vì đọc HTML nhầm → fixture + test bắt ngay tại đây, trước khi ghép mạng.
- `#chapter-c` có div quảng cáo lồng → strip `<script>`, `<div class*=ads>`, `.ads` trước khi lấy text.
  (brainstorm đã thấy regex greedy hỏng — dùng node-html-parser thay regex.)
