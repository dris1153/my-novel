---
phase: 3
title: "Home = thư viện của tôi"
status: done
priority: P1
effort: "2h"
dependencies: [2]
---

# Phase 3: Home = thư viện của tôi

## Overview

Mở web ra phải thấy thư viện của mình, không phải trang catalog công khai.

## Related Code Files

- Modify: `apps/web/src/app/(site)/page.tsx`
- Modify: `apps/web/src/lib/queries.ts`

## Steps

1. Bỏ panel "Đề cử tuần" (khái niệm catalog công khai, và admin đã revert nên không gắn cờ được).
2. H1 "Thư viện" + `AddNovelForm`.
3. Khối "Đang lấy về" (`CrawlProgress`) — chỉ hiện khi có job.
4. Khối "Đọc tiếp" — `reading_progress` mới nhất (đã có `ContinueReading`).
5. Lưới "Tất cả truyện" — mới thêm trước, kèm số chương + nhãn "đọc tới chương N".
6. Giữ `/tu-truyen` (♡), `/the-loai`, `/tim-kiem` nguyên.

## Success Criteria

- [ ] Mở `/` thấy thư viện + ô thêm truyện, không còn panel Đề cử
- [ ] Truyện đang đọc có nhãn tiến độ
- [ ] Empty state vẫn có doodle
