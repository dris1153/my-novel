import { crawl } from './crawl.ts';

function parseArgs(argv: string[]): { url: string; limit?: number } {
  const args = argv.slice(2);
  const url = args.find((a) => !a.startsWith('--'));
  const limitFlag = args.find((a) => a.startsWith('--limit'));

  if (!url) {
    console.error('Dùng: pnpm crawl <url truyenfull> [--limit N]');
    process.exit(1);
  }
  if (!/^https?:\/\/truyenfull\.[a-z]+\//i.test(url)) {
    console.error('URL phải là trang truyện trên truyenfull (vd https://truyenfull.live/ten-truyen/)');
    process.exit(1);
  }

  let limit: number | undefined;
  if (limitFlag) {
    const raw = limitFlag.includes('=') ? limitFlag.split('=')[1] : args[args.indexOf(limitFlag) + 1];
    limit = Number(raw);
    if (!Number.isInteger(limit) || limit <= 0) {
      console.error('--limit phải là số nguyên dương');
      process.exit(1);
    }
  }

  return { url, limit };
}

// Env từ root .env (service_role chỉ sống ở đây, file cục bộ gitignored).
// Không có file cũng được — env có thể đến từ shell.
try {
  process.loadEnvFile?.(new URL('../../../.env', import.meta.url));
} catch {
  // .env không tồn tại; writer.ts sẽ báo rõ nếu thiếu biến bắt buộc.
}

const { url, limit } = parseArgs(process.argv);

crawl(url, { limit }).catch((e) => {
  console.error(`✖ ${e instanceof Error ? e.message : e}`);
  process.exit(1);
});
