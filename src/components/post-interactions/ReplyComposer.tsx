"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type ReplyComposerProps = {
  commentId: string;
  onSuccess?: () => void;
};

export default function ReplyComposer({ commentId, onSuccess }: ReplyComposerProps) {
  const router = useRouter();
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
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-2xl border border-black/10 bg-[#faf7f4] p-4">
      <textarea
        value={content}
        onChange={(event) => {
          setContent(event.target.value);
          if (error) setError(null);
        }}
        rows={3}
        maxLength={1000}
        placeholder="Write a reply..."
        disabled={isSubmitting}
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50 md:text-base"
      />

      <div className="flex items-center justify-between gap-3">
        <div className="min-h-5 text-sm text-red-600">{error}</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSuccess}
            disabled={isSubmitting}
            className="rounded-full px-3 py-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 disabled:cursor-not-allowed disabled:text-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || content.trim().length === 0}
            className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isSubmitting ? "Posting..." : "Reply"}
          </button>
        </div>
      </div>
    </form>
  );
}
