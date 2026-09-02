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
    <form onSubmit={handleSubmit} className="discussion-composer mt-4 space-y-4 px-4 py-4">
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.2em] text-fg-subtle">Reply</p>
        <label htmlFor={contentFieldId} className="block text-sm font-medium text-fg-muted">
          Your reply
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
          className="discussion-composer-field min-h-28 resize-y"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-h-5 text-sm text-danger">{error}</div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
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
            className="discussion-composer-submit"
          >
            {isSubmitting ? "Posting..." : "Reply"}
          </button>
        </div>
      </div>
    </form>
  );
}
