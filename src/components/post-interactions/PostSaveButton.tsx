"use client";

import ActionFeedback from "./ActionFeedback";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { formatSaveCount, getSaveLabel } from "./postSaveState";

type PostSaveButtonProps = {
  postId: string;
  hasLiked: boolean;
  isSignedIn: boolean;
  likeCount: number;
  signInHref: string;
};

export default function PostSaveButton({
  postId,
  hasLiked,
  isSignedIn,
  likeCount,
  signInHref,
}: PostSaveButtonProps) {
  const router = useRouter();
  const messageId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignInHint, setShowSignInHint] = useState(false);

  async function handleToggleSave() {
    if (isSubmitting) {
      return;
    }

    if (!isSignedIn) {
      setError(null);
      setShowSignInHint(true);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setShowSignInHint(false);

    try {
      const response = await fetch(`/api/posts/${postId}/likes`, {
        method: hasLiked ? "DELETE" : "POST",
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        setError(data?.message ?? "Could not update saved state.");
        return;
      }

      router.refresh();
    } catch {
      setError("Could not update saved state.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const helperMessage = error || showSignInHint;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-full border border-border bg-surface px-3 py-2 text-sm text-fg-muted shadow-[var(--shadow-soft)]">
      <button
        type="button"
        aria-pressed={isSignedIn ? hasLiked : undefined}
        aria-describedby={helperMessage ? messageId : undefined}
        onClick={handleToggleSave}
        disabled={isSubmitting}
        className="rounded-full border border-border bg-subtle px-3 py-1.5 font-medium text-fg transition hover:border-border-strong hover:bg-accent-soft disabled:cursor-not-allowed disabled:text-fg-subtle"
      >
        {isSubmitting ? "Updating..." : getSaveLabel(hasLiked)}
      </button>
      <span className="text-fg-muted">{formatSaveCount(likeCount)}</span>
      <ActionFeedback
        messageId={messageId}
        error={error}
        signInHref={showSignInHint ? signInHref : undefined}
        signInPrompt={showSignInHint ? "to save this post." : null}
      />
    </div>
  );
}
