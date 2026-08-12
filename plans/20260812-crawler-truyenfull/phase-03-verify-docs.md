---
phase: 3
title: "Verify + docs"
status: pending
priority: P2
effort: "1.5h"
dependencies: [2]
---

# Phase 3: Verify + docs

## Overview

Chạy end-to-end thật: `--limit` nhỏ, test resume (ngắt giữa chừng + chạy lại), review truyện
nháp trong admin, viết mục README. Chốt feature.

## Requirements

- Functional: verify full flow trên truyện thật, resume hoạt động, truyện hiện trong admin.
- Non-functional: hướng dẫn dùng rõ để lần sau chạy không cần đọc code.

## Architecture

Không code mới — chỉ verify + doc. (Nếu verify lộ bug → quay lại phase 2.)

## Related Code Files

- Modify: `README.md` (thêm mục "Crawl truyện từ truyenfull")
- Modify: `plan.md` (đánh dấu phases completed)

## Implementation Steps

1. `pnpm crawl https://truyenfull.live/dai-phung-da-canh-nhan/ --limit 10` → kiểm 10 chương trong DB.
2. Test resume: chạy `--limit 25`, Ctrl+C giữa chừng (~chương 15), chạy lại `--limit 25` →
   phải skip chương đã có, tiếp tục tới 25, không trùng.
3. Mở admin (`pnpm admin`) → truyện xuất hiện dạng nháp (published=false), cover hiện, chương đọc được.
4. (Tuỳ chọn) Full run không `--limit` để lấy trọn ~2100 chương — nếu user muốn dữ liệu thật.
5. README mục crawl: cần Node 22, env service_role, lệnh, cờ `--limit`, ghi chú CF resume + pháp lý.
6. Đánh dấu plan phases completed.

## Success Criteria

- [ ] `--limit 10` → đúng 10 chương, đọc được nội dung tiếng Việt có ngăn đoạn
- [ ] Resume: ngắt rồi chạy lại → không trùng chương, tiếp đúng chỗ
- [ ] Truyện nháp hiện trong admin, cover từ R2, chương render đúng
- [ ] README có mục crawl đủ để chạy lại không cần đọc source
- [ ] `plan.md` phases = completed

## Risk Assessment

- Full 2100 chương mất 40-70 phút + có thể bị CF ban → verify bằng `--limit` là đủ để nghiệm thu;
  full run là việc chạy dữ liệu thật của user, không phải điều kiện nghiệm thu code.
- Nếu admin chưa render được truyện nháp (published=false) do RLS/query → kiểm lại admin đã cho admin
  xem novel chưa published (RLS policy "novels: admin toàn quyền" đã có → OK).
