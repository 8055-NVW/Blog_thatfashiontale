"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useId, useState } from "react";

type ReplyComposerProps = {
  commentId: string;
  onSuccess?: () => void;
};

export default function ReplyComposer({ commentId, onSuccess }: ReplyComposerProps) {
  const router = useRouter();
  const contentFieldId = useId();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/comments/${commentId}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: trimmedContent }),
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        setError(data?.message ?? "Failed to post reply.");
        return;
      }

      setContent("");
      onSuccess?.();
      router.refresh();
    } catch {
      setError("Failed to post reply.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-lg border border-border bg-surface px-4 py-4 shadow-[var(--shadow-soft)]">
      <div className="space-y-2">
        <label htmlFor={contentFieldId} className="block text-sm font-medium text-fg-muted">
          Reply
        </label>

        <textarea
          id={contentFieldId}
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            if (error) setError(null);
          }}
          rows={3}
          maxLength={1000}
          placeholder="Write a reply..."
          disabled={isSubmitting}
          className="w-full rounded-lg border border-border bg-subtle px-4 py-3 text-sm text-fg outline-none transition placeholder:text-fg-subtle focus:border-border-strong disabled:cursor-not-allowed disabled:text-fg-subtle md:text-base"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="min-h-5 text-sm text-danger">{error}</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSuccess}
            disabled={isSubmitting}
            className="quiet-action disabled:text-fg-subtle"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || content.trim().length === 0}
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-fg-inverse transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-surface-strong disabled:text-fg-subtle"
          >
            {isSubmitting ? "Posting..." : "Reply"}
          </button>
        </div>
      </div>
    </form>
  );
}
