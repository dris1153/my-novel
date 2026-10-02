---
phase: 10
title: "Motion"
status: pending
priority: P2
effort: "1d"
dependencies: [4, 5, 6, 7, 8]
---

# Phase 10: Motion (transitions-dev)

## Overview

Áp motion CSS từ skill `transitions-dev` (đã cài ở phase 1), chọn lọc giữ chất quiet/editorial.
Bắt buộc giữ `prefers-reduced-motion` của mọi snippet.

## Related Code Files

- Modify: `apps/web/src/app/globals.css` (import `_root.css` / dán block token motion)
- Modify: các component liên quan (skeleton, like, toast, tabs, accordion)

## Đã áp (snippet dán nguyên từ skill)

| Chỗ | Transition | Ghi chú |
|---|---|---|
| Khối chờ nội dung (`loading.tsx` ở `(site)`, thể loại, chi tiết, reader) | `skeleton-reveal` (14) — **chỉ phần pulse** | Next thay cả cây khi dữ liệu về nên nửa cross-fade của snippet không áp được |
| ♡ Theo dõi ở trang truyện | `like-button` (23) | Màu tim = `--like-color` = oxblood `#5e0831` (dark `#e0a1bb`), không dùng hot pink ngoài palette |
| Mô tả truyện | `accordion` (21) | `grid-template-rows: 0fr ↔ 1fr` + chevron `scaleY`; mặc định mở để mô tả vẫn ở trong HTML đầu |

## Cố tình KHÔNG áp (và vì sao)

- `texts-reveal` (18) cho hero trang chủ: hero chỉ là một dòng h1 — tách span theo dòng có nguy cơ layout shift, mà tiêu chí của phase này là **không** gây layout shift.
- `tabs-sliding` (16): sau khi chuyển phân trang sang route, không còn segmented control nào.
- `page-side-by-side`, `number-pop-in`, `input-clear-dissolve`, `toast`, `modal`: chưa có chỗ dùng xứng đáng; thêm vào lúc này là trang trí thừa, trái tinh thần "quiet/editorial" của DESIGN.md.

## Success Criteria

- [x] Mọi snippet giữ block `prefers-reduced-motion` (3/3 transition)
- [x] Không dùng `transition: all`
- [x] Nhịp điệu lấy từ biến của skill (`--acc-*`, `--like-*`, `--pulse-*`), không hardcode rải rác
- [x] Không motion nào gây layout shift
