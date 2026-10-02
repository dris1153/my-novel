---
phase: 2
title: "Thêm truyện bằng URL trong web"
status: done
priority: P0
effort: "4h"
dependencies: [1]
---

# Phase 2: Thêm truyện bằng URL

## Overview

Dán URL → web spawn CLI crawl → UI hiện tiến trình live → đọc được ngay khi có chương.

## Architecture

Job registry **trong bộ nhớ** của Next server, key theo URL. Không cần bảng DB: tiến độ
suy ra từ số chương đã có trong DB (crawler tự ghi). Server restart thì mất trạng thái
"đang chạy", nhưng crawl vẫn tiếp và resume-safe nên bấm lại là chạy tiếp.

## Related Code Files

- Create: `apps/web/src/lib/crawl-runner.ts` (spawn + registry + parse stdout)
- Create: `apps/web/src/components/novel/add-novel-form.tsx`
- Create: `apps/web/src/components/novel/crawl-progress.tsx`
- Create: `apps/web/src/app/api/crawl/route.ts` (GET trạng thái)
- Modify: `apps/web/src/lib/actions.ts` (`addNovelByUrl`)
- Modify: `apps/web/src/lib/queries.ts` (`fetchNovelProgress`)

## Steps

1. `spawn(tsx, [cli.ts, url], { cwd: repoRoot, detached: true, stdio: pipe })`.
   Parse stdout: `novel id=<uuid>` để gắn job ↔ truyện; đọc exit code để biết lỗi.
2. Registry: `Map<url, { novelId, startedAt, error, done }>`.
3. `GET /api/crawl` → mỗi job kèm tên truyện + số chương hiện có (đọc DB bằng public client).
4. `AddNovelForm` (client, `useActionState`) + `CrawlProgress` (client, poll 2s, `router.refresh()` khi xong).
5. Validate URL phải là `truyenfull.*`.

## Success Criteria

- [ ] Dán URL → job chạy, UI hiện "đang lấy…"
- [ ] Có chương là đọc được ngay
- [ ] Dán trùng URL đang chạy → không spawn thêm
- [ ] Lỗi (Cloudflare, URL sai) hiện ra UI, không treo
