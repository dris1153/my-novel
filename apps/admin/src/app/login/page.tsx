"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const { error } = await createClient().auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });

    if (error) {
      setError("Email hoặc mật khẩu không đúng");
      setBusy(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8"
      >
        <h1 className="font-serif text-2xl tracking-tight">Novel Admin</h1>
        <p className="mt-1 mb-6 text-sm text-ink-2">Đăng nhập để quản lý truyện.</p>

        <label className="mb-1 block text-xs font-semibold text-ink-2" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mb-4 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-sienna"
        />

        <label className="mb-1 block text-xs font-semibold text-ink-2" htmlFor="password">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mb-5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-sienna"
        />

        {error && <p className="mb-4 text-sm text-sienna">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-sienna py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
      </form>
    </main>
  );
}
