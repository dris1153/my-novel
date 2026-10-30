import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { isAllowedEmail } from "@/lib/identity";

/**
 * Gate toàn site: nội dung truyện có bản quyền, chỉ người trong ALLOWED_EMAILS được xem.
 * Server Action/route vẫn tự gọi `requireUser()`.
 */
export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  if (pathname === "/dang-nhap" || pathname.startsWith("/api/auth/")) return;
  if (req.auth?.user?.id && isAllowedEmail(req.auth.user.email)) return;

  if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL("/dang-nhap", req.nextUrl);
  if (pathname !== "/") url.searchParams.set("from", pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
});

// Không loại trừ theo đuôi file; chỉ miễn file tĩnh build ra. Xem gate.test.ts.
export const config = {
  matcher: ["/((?!_next/static|favicon\\.ico).*)"],
};
