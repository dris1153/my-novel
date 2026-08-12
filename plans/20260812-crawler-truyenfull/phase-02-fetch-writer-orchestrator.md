---
phase: 2
title: "Fetch + Writer + Orchestrator"
status: pending
priority: P1
effort: "4h"
dependencies: [1]
---

# Phase 2: Fetch + Writer + Orchestrator

## Overview

Ghép tầng mạng (fetch có UA/retry/throttle/CF-detect), tầng ghi DB (Supabase service_role +
R2 cover), và orchestrator + CLI. Sau phase này `pnpm crawl <url> --limit 5` chạy được thật.

## Requirements

- Functional: fetch trang có UA, retry backoff, delay ~1s/request, phát hiện CF challenge → abort.
  upsert novel (published=false) + map genres + upload cover R2 + upsert chapters resume-safe.
  CLI parse URL + `--limit N`, log tiến độ.
- Non-functional: service_role KHÔNG lộ ra client. 1 chương lỗi không làm chết cả job.

## Architecture

```
packages/crawler/src/
├── fetch.ts    # fetchHtml(url): retry(3) + backoff, UA header, throttle, detect CF (403 sau khi từng 200 / <title>challenge)
├── writer.ts   # upsertNovel, mapGenres, uploadCover(R2), upsertChapters — dùng @supabase/supabase-js service_role
├── crawl.ts    # orchestrator: meta → novel → cover → gom link 42 trang → skip đã có → fetch từng chương → upsert
└── cli.ts      # entry: đọc argv (url, --limit), load env, gọi crawl, exit code
```

Luồng orchestrator (crawl.ts):
```
1. fetchHtml(listingUrl) → parseListingMeta
2. writer.upsertNovel({...meta, published:false, slug:slugify(title)}) → novelId
3. writer.mapGenres(novelId, genreSlugs) — miss → console.warn, bỏ qua
4. writer.uploadCover(novelId, coverUrl) — fail → warn, để cover_url null
5. for trang 1..totalPages: fetchHtml(/trang-N/) → parseChapterLinks → gom
6. query chapters đã có (novel_id) → Set<number> → skip
7. for mỗi chương thiếu (cắt theo --limit): fetchHtml → parseChapterContent
   → writer.upsertChapter({novel_id, number, title, content, word_count:countWords})
   → delay throttle. Lỗi 1 chương → warn + continue.
8. log "N/total done"
```

## Related Code Files

- Create: `packages/crawler/src/fetch.ts`, `writer.ts`, `crawl.ts`, `cli.ts`
- Modify: `packages/crawler/package.json` (deps `@supabase/supabase-js`, `@aws-sdk/client-s3`; script `crawl`)
- Modify: root `package.json` (script `crawl": "pnpm --filter crawler crawl"`)
- Modify: root `.env.example` (thêm `SUPABASE_SERVICE_ROLE_KEY` — ghi rõ crawler-only)
- Reuse: `shared` (`slugify`, `countWords`), pattern R2 từ `apps/admin/src/lib/r2.ts` (copy tối giản, không import cross-app)

## Implementation Steps

1. `fetch.ts`: `fetchHtml(url, {retries=3})` — header UA Chrome, `res.status===403||/challenge|cf-turnstile/i.test(html)`
   → throw `ChallengeError`. 429/5xx → backoff `2^n * 1s`. Delay throttle export riêng `sleep(ms)`.
2. `writer.ts`: khởi tạo supabase client với `SUPABASE_SERVICE_ROLE_KEY`. Hàm upsertNovel/mapGenres/
   uploadCover(PutObjectCommand→publicUrl)/upsertChapter. Cover: fetch ảnh (UA) → Buffer → PutObject.
3. `crawl.ts`: orchestrator theo luồng trên. ChallengeError → in "Cloudflare chặn. Chạy lại lệnh để resume." → exit 1.
4. `cli.ts`: parse argv thủ công (url bắt buộc, `--limit N` optional). Validate URL host = truyenfull.
   Load env (`process.loadEnvFile('.env')` hoặc dotenv). Thiếu env → lỗi rõ ràng.
5. Script `crawl` trong crawler package: `node --experimental-strip-types src/cli.ts` (Node 22 chạy TS trực tiếp)
   hoặc `tsx`. Kiểm Node 22.22 hỗ trợ `--experimental-strip-types` (có).
6. Test tay: `pnpm crawl <url> --limit 5`.

## Success Criteria

- [ ] `pnpm crawl <url> --limit 5` → 1 truyện `published=false` + đúng 5 chương trong Supabase
- [ ] Cover xuất hiện trong R2, `novels.cover_url` trỏ đúng public URL
- [ ] Genre khớp được link vào `novel_genres`; genre miss chỉ warn, không crash
- [ ] Chạy lại lệnh → 5 chương cũ bị skip (log "skip"), không tạo trùng
- [ ] ChallengeError → thông báo resume rõ ràng, exit code ≠ 0
- [ ] `git grep SERVICE_ROLE apps/` = rỗng (key không lọt vào mobile/admin)

## Risk Assessment

- service_role rò rỉ → CHỈ dùng trong packages/crawler + root .env (gitignored). Không thêm vào EXPO_PUBLIC_/NEXT_PUBLIC_.
- Node TS runtime: nếu `--experimental-strip-types` lỗi với enum/import phức tạp → fallback `tsx` (thêm devDep).
- R2 cover fetch cũng bị CF chặn? Ảnh trên domain khác (thường statically/cdn) → thử; fail thì để null, không chặn job.
