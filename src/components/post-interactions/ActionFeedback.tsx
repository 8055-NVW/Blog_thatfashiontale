import Link from "next/link";

type ActionFeedbackProps = {
  messageId: string;
  error?: string | null;
  signInHref?: string;
  signInPrompt?: string | null;
};

export default function ActionFeedback({
  messageId,
  error,
  signInHref,
  signInPrompt,
}: ActionFeedbackProps) {
  if (error) {
    return (
      <span id={messageId} className="text-danger">
        {error}
      </span>
    );
  }

  if (signInHref && signInPrompt) {
    return (
      <span id={messageId} className="text-fg-subtle">
        <Link
          href={signInHref}
          className="underline decoration-border-strong underline-offset-4 transition hover:text-fg hover:decoration-fg-muted"
        >
          Sign in
        </Link>{" "}
        {signInPrompt}
      </span>
    );
  }

  return null;
}
