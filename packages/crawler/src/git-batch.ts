import { execFile } from 'node:child_process';
import { realpathSync } from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);
const PUSH_RETRIES = 3;

async function git(dir: string, ...args: string[]): Promise<string> {
  const { stdout } = await run('git', args, { cwd: dir, maxBuffer: 16 * 1024 * 1024 });
  return stdout.trim();
}

/** Clone phải là git repo đang ở main, nếu không push sẽ đi nhầm nhánh. */
export async function assertDataRepo(dir: string): Promise<void> {
  try {
    // `git add -A` sẽ quét cả repo cha nếu dir chỉ là thư mục con của một repo khác.
    const top = await git(dir, 'rev-parse', '--show-toplevel');
    const norm = (p: string) => {
      // realpath: Windows có thể trả đường dẫn ngắn 8.3 (DUONGM~1) cho cùng một thư mục.
      const r = realpathSync.native(path.resolve(p));
      return process.platform === 'win32' ? r.toLowerCase() : r;
    };
    if (norm(top) !== norm(dir)) throw new Error('không phải thư mục gốc của repo git');
    const branch = await git(dir, 'rev-parse', '--abbrev-ref', 'HEAD');
    if (branch !== 'main') throw new Error(`đang ở nhánh "${branch}", cần "main"`);
  } catch (e) {
    throw new Error(`DATA_REPO_DIR (${dir}) không dùng được: ${e instanceof Error ? e.message : e}`);
  }
}

// --autostash: lần crawl trước bị ngắt giữa chừng có thể để lại file chưa commit.
export async function syncFromRemote(dir: string): Promise<void> {
  await git(dir, 'pull', '--rebase', '--autostash');
}

/** Commit mọi thay đổi và push main. Trả về true nếu có gì được commit/push. */
export async function commitAndPush(dir: string, message: string): Promise<boolean> {
  await git(dir, 'add', '-A');
  const dirty = await git(dir, 'status', '--porcelain');
  if (dirty) await git(dir, 'commit', '-m', message);

  // Commit còn kẹt từ lần push thất bại trước đó cũng phải được đẩy lên.
  const ahead = Number(await git(dir, 'rev-list', '--count', '@{u}..HEAD'));
  if (!dirty && ahead === 0) return false;

  for (let attempt = 1; ; attempt++) {
    try {
      await git(dir, 'push', 'origin', 'main');
      return true;
    } catch (e) {
      if (attempt >= PUSH_RETRIES) throw e;
      await git(dir, 'pull', '--rebase');
    }
  }
}
