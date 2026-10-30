import { isSlug } from "shared/src/store.ts";

import { getAuthorizedUser } from "@/lib/auth";
import { setProgress } from "@/lib/state-ops";
import { mutateMyState } from "@/lib/state-store";

const MAX_CHAPTER = 1_000_000;

/** Gọi từ client lúc đổi chương / rời trang (fetch keepalive), nên là route handler chứ không phải server action. */
export async function POST(req: Request) {
  if (!(await getAuthorizedUser())) return new Response(null, { status: 401 });

  const body = (await req.json().catch(() => null)) as { slug?: unknown; chapter?: unknown; scroll?: unknown } | null;
  const { slug, chapter, scroll } = body ?? {};
  if (
    typeof slug !== "string" ||
    !isSlug(slug) ||
    typeof chapter !== "number" ||
    !Number.isInteger(chapter) ||
    chapter < 1 ||
    chapter > MAX_CHAPTER ||
    typeof scroll !== "number" ||
    !(scroll >= 0 && scroll <= 1)
  ) {
    return new Response(null, { status: 400 });
  }

  const now = new Date().toISOString();
  await mutateMyState((state) => setProgress(state, { slug, chapter, scroll }, now));
  return new Response(null, { status: 204 });
}
