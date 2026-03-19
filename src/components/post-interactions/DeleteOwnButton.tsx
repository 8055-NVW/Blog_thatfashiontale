"use client";

import ActionFeedback from "./ActionFeedback";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

type DeleteOwnButtonProps = {
  commentId: string;
  itemLabel: "comment" | "reply";
};

export default function DeleteOwnButton({ commentId, itemLabel }: DeleteOwnButtonProps) {
  const router = useRouter();
  const messageId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (isSubmitting) {
      return;
    }

    const confirmed = window.confirm(`Delete this ${itemLabel}?`);

    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        setError(data?.message ?? `Could not delete ${itemLabel}.`);
        return;
      }

      router.refresh();
    } catch {
      setError(`Could not delete ${itemLabel}.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-describedby={error ? messageId : undefined}
        onClick={handleDelete}
        disabled={isSubmitting}
        className="quiet-action hover:text-danger disabled:text-fg-subtle"
      >
        {isSubmitting ? "Deleting..." : "Delete"}
      </button>
      <ActionFeedback messageId={messageId} error={error} />
    </>
  );
}
