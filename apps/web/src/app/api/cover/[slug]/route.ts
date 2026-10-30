import { coverPath, isSlug } from "shared";

import { readBinary } from "@/lib/github-store";

export async function GET(_req: Request, ctx: RouteContext<"/api/cover/[slug]">) {
  const { slug } = await ctx.params;
  if (!isSlug(slug)) return new Response(null, { status: 404 });

  const bytes = await readBinary(coverPath(slug));
  if (!bytes) return new Response(null, { status: 404 });

  return new Response(bytes, {
    headers: {
      "Content-Type": "image/jpeg",
      // `private`: route này nằm sau đăng nhập (phase 4), không để CDN dùng chung giữa người dùng.
      "Cache-Control": "private, max-age=86400",
    },
  });
}
