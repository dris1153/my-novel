"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import type { AuthState } from "@/lib/actions";

export function AuthForm({
  mode,
  action,
}: {
  mode: "signin" | "signup";
  action: (prev: AuthState, form: FormData) => Promise<AuthState>;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null } as AuthState);
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {isSignup && (
        <div>
          <Label htmlFor="display_name">Tên hiển thị</Label>
          <Input id="display_name" name="display_name" autoComplete="nickname" />
        </div>
      )}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>

      <div>
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete={isSignup ? "new-password" : "current-password"}
        />
      </div>

      {state.error && <p className="text-sm text-sepia-text">{state.error}</p>}
      {state.message && <p className="text-sm text-forest">{state.message}</p>}

      <Button type="submit" disabled={pending} className="mt-1 w-full py-3">
        {pending ? "Đang xử lý…" : isSignup ? "Tạo tài khoản" : "Đăng nhập"}
      </Button>

      <p className="text-center text-sm text-ink-3">
        {isSignup ? (
          <>
            Đã có tài khoản?{" "}
            <Link href="/dang-nhap" className="text-sepia-text hover:underline">
              Đăng nhập
            </Link>
          </>
        ) : (
          <>
            Chưa có tài khoản?{" "}
            <Link href="/dang-ky" className="text-sepia-text hover:underline">
              Đăng ký
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
