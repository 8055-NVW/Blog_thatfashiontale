import Link from "next/link";

type SignInPromptProps = {
  signInHref?: string;
};

export default function SignInPrompt({ signInHref = "/signin" }: SignInPromptProps) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-[#faf7f4] px-5 py-4 text-sm text-gray-700">
      <p>
        Join the conversation by {" "}
        <Link href={signInHref} className="font-medium text-gray-900 underline decoration-gray-400 underline-offset-4 transition hover:decoration-gray-900">
          signing in
        </Link>.
      </p>
    </div>
  );
}
