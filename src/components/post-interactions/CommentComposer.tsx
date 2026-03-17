"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type CommentComposerProps = {
  postId: string;
};

export default function CommentComposer({ postId }: CommentComposerProps) {
  const router = useRouter();
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
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-black/10 bg-[#faf7f4] p-5">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-gray-900">Add a comment</h3>
        <p className="text-sm text-gray-600">Share a thoughtful response to the post.</p>
      </div>

      <textarea
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
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50"
      />

      <div className="flex items-center justify-between gap-3">
        <div className="min-h-5 text-sm">
          {error ? <p className="text-red-600">{error}</p> : null}
          {!error && success ? <p className="text-green-700">{success}</p> : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || content.trim().length === 0}
          className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isSubmitting ? "Posting..." : "Post comment"}
        </button>
      </div>
    </form>
  );
}
