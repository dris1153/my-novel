"use client";

import { useState, useTransition } from "react";

import { LikeButton } from "@/components/ui/like-button";
import { setNovelSaved } from "@/lib/actions";

export function FollowButton({ slug, initialSaved }: { slug: string; initialSaved: boolean }) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  function toggle(next: boolean) {
    setSaved(next);
    startTransition(async () => {
      try {
        await setNovelSaved(slug, next);
      } catch {
        setSaved(!next);
      }
    });
  }

  return (
    <LikeButton
      liked={saved}
      onToggle={toggle}
      disabled={pending}
      labelOn="Đã theo dõi"
      labelOff="Theo dõi"
    />
  );
}
