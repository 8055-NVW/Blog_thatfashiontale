"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useId, useState } from "react";

type CommentComposerProps = {
  postId: string;
};

export default function CommentComposer({ postId }: CommentComposerProps) {
  const router = useRouter();
  const contentFieldId = useId();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: trimmedContent }),
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        setError(data?.message ?? "Failed to post comment.");
        return;
      }

      setContent("");
      setSuccess("Comment posted.");
      router.refresh();
    } catch {
      setError("Failed to post comment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-subtle px-5 py-5 shadow-[var(--shadow-soft)]">
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-fg">Add a comment</h3>
        <p className="text-sm leading-6 text-fg-muted">Share a thoughtful response to the post.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor={contentFieldId} className="block text-sm font-medium text-fg-muted">
          Comment
        </label>

        <textarea
          id={contentFieldId}
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            if (error) setError(null);
            if (success) setSuccess(null);
          }}
          rows={4}
          maxLength={1000}
          placeholder="Write your comment here..."
          disabled={isSubmitting}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-fg outline-none transition placeholder:text-fg-subtle focus:border-border-strong disabled:cursor-not-allowed disabled:text-fg-subtle"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="min-h-5 text-sm">
          {error ? <p className="text-danger">{error}</p> : null}
          {!error && success ? <p className="text-success">{success}</p> : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || content.trim().length === 0}
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-fg-inverse transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-surface-strong disabled:text-fg-subtle"
        >
          {isSubmitting ? "Posting..." : "Post comment"}
        </button>
      </div>
    </form>
  );
}
