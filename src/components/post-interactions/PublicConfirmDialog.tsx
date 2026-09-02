"use client";

import { getTrapWrapTarget, HOTSPOT_DIALOG_FOCUSABLE_SELECTOR } from "@/lib/hotspotDialogFocus";
import { useEffect, useRef } from "react";

type PublicConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function PublicConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  isSubmitting = false,
  onConfirm,
  onClose,
}: PublicConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const dialogElement = dialogRef.current;

    const getFocusableElements = () => {
      if (!dialogElement) {
        return [];
      }

      return Array.from(dialogElement.querySelectorAll<HTMLElement>(HOTSPOT_DIALOG_FOCUSABLE_SELECTOR));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogElement?.focus();
        return;
      }

      if (!dialogElement?.contains(document.activeElement)) {
        event.preventDefault();
        const fallbackTarget = event.shiftKey
          ? focusableElements[focusableElements.length - 1]
          : focusableElements[0];
        fallbackTarget?.focus();
        return;
      }

      const wrapTarget = getTrapWrapTarget(focusableElements, document.activeElement as HTMLElement | null, event.shiftKey);

      if (wrapTarget) {
        event.preventDefault();
        wrapTarget.focus();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    const focusTimer = window.requestAnimationFrame(() => {
      cancelButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSubmitting, onClose]);

  return (
    <div
      className="public-dialog-backdrop fixed inset-0 z-50 flex items-end p-2 md:items-center md:justify-center md:p-4"
      role="presentation"
      onClick={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        tabIndex={-1}
        className="public-dialog-surface w-full max-w-lg p-5 md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="space-y-3">
          <p className="meta-label">Confirm action</p>
          <h2 id="confirm-dialog-title" className="text-[1.55rem] font-semibold leading-tight tracking-[-0.03em] text-fg md:text-[1.8rem]">
            {title}
          </h2>
          <p id="confirm-dialog-description" className="max-w-xl text-sm leading-7 text-fg-muted md:text-[0.98rem]">
            {description}
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="quiet-action disabled:text-fg-subtle"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-danger/35 bg-surface px-4 py-2 text-sm font-medium text-danger transition hover:bg-danger hover:text-fg-inverse disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-strong disabled:text-fg-subtle"
          >
            {isSubmitting ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
