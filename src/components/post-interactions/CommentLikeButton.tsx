"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { formatLikeCount } from "./discussionLikeState";

type CommentLikeButtonProps = {
  commentId: string;
  hasLiked: boolean;
  isSignedIn: boolean;
  likeCount: number;
  signInHref: string;
};

export default function CommentLikeButton({
  commentId,
  hasLiked,
  isSignedIn,
  likeCount,
  signInHref,
}: CommentLikeButtonProps) {
  const router = useRouter();
  const messageId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignInHint, setShowSignInHint] = useState(false);

  async function handleToggleLike() {
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
      const response = await fetch(`/api/comments/${commentId}/likes`, {
        method: hasLiked ? "DELETE" : "POST",
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        setError(data?.message ?? "Could not update like.");
        return;
      }

      router.refresh();
    } catch {
      setError("Could not update like.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const helperMessage = error ? (
    <span id={messageId} className="text-amber-700">
      {error}
    </span>
  ) : showSignInHint ? (
    <span id={messageId} className="text-gray-500">
      <Link
        href={signInHref}
        className="underline decoration-gray-300 underline-offset-4 transition hover:text-gray-900 hover:decoration-gray-700"
      >
        Sign in
      </Link>{" "}
      to like.
    </span>
  ) : null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <button
        type="button"
        aria-pressed={isSignedIn ? hasLiked : undefined}
        aria-describedby={helperMessage ? messageId : undefined}
        onClick={handleToggleLike}
        disabled={isSubmitting}
        className="font-medium text-gray-600 transition hover:text-gray-900 disabled:cursor-not-allowed disabled:text-gray-400"
      >
        {isSubmitting ? "Saving..." : hasLiked ? "Liked" : "Like"}
      </button>
      <span>{formatLikeCount(likeCount)}</span>
      {helperMessage}
    </div>
  );
}
