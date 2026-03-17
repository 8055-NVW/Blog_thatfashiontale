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
    <div className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-12">
      <section className="w-full rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Sign in</p>
        <div className="mt-4 space-y-3">
          <h1 className="text-3xl font-semibold text-gray-900">Continue your reading</h1>
          <p className="text-sm leading-7 text-gray-600">
            Sign in to save posts, join the discussion, and pick up where you left off.
          </p>
        </div>

        <div className="mt-8">
          <SignInButton callbackUrl={callbackUrl} />
        </div>
      </section>
    </div>
  );
}
