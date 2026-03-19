import { SignInButton } from "@/components/SignInButton";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { sanitizeCallbackUrl } from "@/lib/authRedirect";

type SignInPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function Home({ searchParams }: SignInPageProps) {
  const session = await auth();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const callbackUrl = sanitizeCallbackUrl(resolvedSearchParams?.callbackUrl);

  if (session?.user) {
    redirect(callbackUrl);
  }

  return (
    <div className="form-container flex min-h-[70vh] items-center py-12 md:py-16">
      <section className="w-full rounded-xl border border-border bg-surface px-7 py-8 shadow-[var(--shadow-soft)] md:px-8 md:py-9">
        <p className="text-[11px] uppercase tracking-[0.28em] text-fg-subtle">Sign in</p>
        <div className="mt-4 space-y-4">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-fg md:text-[2.15rem]">Continue your reading</h1>
          <p className="text-sm leading-7 text-fg-muted md:text-base md:leading-8">
            Sign in to save posts, join the discussion, and pick up where you left off.
          </p>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-subtle px-5 py-5">
          <SignInButton callbackUrl={callbackUrl} />
          <p className="mt-4 text-sm leading-6 text-fg-muted">
            You&apos;ll return to the same story or page after signing in.
          </p>
        </div>
      </section>
    </div>
  );
}
