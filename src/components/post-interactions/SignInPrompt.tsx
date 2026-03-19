import Link from "next/link";

type SignInPromptProps = {
  signInHref?: string;
};

export default function SignInPrompt({ signInHref = "/signin" }: SignInPromptProps) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-subtle px-5 py-4 text-sm leading-6 text-fg-muted">
      <p>
        Join the conversation by {" "}
        <Link href={signInHref} className="font-medium text-fg underline decoration-border-strong underline-offset-4 transition hover:decoration-fg-muted">
          signing in
        </Link>.
      </p>
    </div>
  );
}
