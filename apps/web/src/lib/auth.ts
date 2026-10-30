import { cache } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { isAllowedEmail } from "@/lib/identity";

/** Kiểm tra whitelist mỗi lần: gỡ email khỏi ALLOWED_EMAILS thì phiên đang sống cũng mất hiệu lực. */
export const getAuthorizedUser = cache(async () => {
  const session = await auth();
  const user = session?.user;
  return user?.id && isAllowedEmail(user.email) ? user : null;
});

/**
 * Trang/Server Action cần đăng nhập. Luôn gọi ở phía server — proxy chỉ là lớp chặn đầu,
 * không phải ranh giới bảo mật duy nhất.
 */
export async function requireUser() {
  const user = await getAuthorizedUser();
  if (!user) redirect("/dang-nhap");
  return { user };
}
