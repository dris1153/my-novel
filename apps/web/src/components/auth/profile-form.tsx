"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { updateDisplayName, type AuthState } from "@/lib/actions";

export function ProfileForm({ initialName }: { initialName: string }) {
  const [state, formAction, pending] = useActionState(updateDisplayName, {
    error: null,
  } as AuthState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="display_name">Tên hiển thị</Label>
        <Input id="display_name" name="display_name" defaultValue={initialName} />
      </div>

      {state.error && <p className="text-sm text-sepia-text">{state.error}</p>}
      {state.message && <p className="text-sm text-forest">{state.message}</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Đang lưu…" : "Lưu"}
      </Button>
    </form>
  );
}
