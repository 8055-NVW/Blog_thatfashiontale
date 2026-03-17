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
      <span id={messageId} className="text-amber-700">
        {error}
      </span>
    );
  }

  if (signInHref && signInPrompt) {
    return (
      <span id={messageId} className="text-gray-500">
        <Link
          href={signInHref}
          className="underline decoration-gray-300 underline-offset-4 transition hover:text-gray-900 hover:decoration-gray-700"
        >
          Sign in
        </Link>{" "}
        {signInPrompt}
      </span>
    );
  }

  return null;
}
