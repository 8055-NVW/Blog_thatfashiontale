"use client";

import ActionFeedback from "./ActionFeedback";
import PublicConfirmDialog from "./PublicConfirmDialog";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

type DeleteOwnButtonProps = {
  commentId: string;
  itemLabel: "comment" | "reply";
};

export default function DeleteOwnButton({ commentId, itemLabel }: DeleteOwnButtonProps) {
  const router = useRouter();
  const messageId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isConfirmOpen) {
      triggerRef.current?.focus();
    }
  }, [isConfirmOpen]);

  async function handleDelete() {
    if (isSubmitting) {
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

      setIsConfirmOpen(false);
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
        ref={triggerRef}
        type="button"
        aria-describedby={error ? messageId : undefined}
        onClick={() => {
          if (!isSubmitting) {
            setError(null);
            setIsConfirmOpen(true);
          }
        }}
        disabled={isSubmitting}
        className="quiet-action hover:text-danger disabled:text-fg-subtle"
      >
        {isSubmitting ? "Deleting..." : "Delete"}
      </button>
      <ActionFeedback messageId={messageId} error={error} />
      {isConfirmOpen ? (
        <PublicConfirmDialog
          title={`Delete this ${itemLabel}?`}
          description={`This will remove the ${itemLabel} from the discussion. This action cannot be undone.`}
          confirmLabel={`Delete ${itemLabel}`}
          isSubmitting={isSubmitting}
          onConfirm={handleDelete}
          onClose={() => {
            if (!isSubmitting) {
              setIsConfirmOpen(false);
            }
          }}
        />
      ) : null}
    </>
  );
}
