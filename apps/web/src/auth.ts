import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { isAllowedEmail, userIdFromEmail } from "@/lib/identity";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: "/dang-nhap", error: "/dang-nhap" },
  callbacks: {
    signIn: ({ profile }) => Boolean(profile?.email_verified) && isAllowedEmail(profile?.email),
    jwt({ token, profile }) {
      if (profile?.email) token.uid = userIdFromEmail(profile.email);
      return token;
    },
    session({ session, token }) {
      session.user.id = typeof token.uid === "string" ? token.uid : "";
      return session;
    },
  },
});
