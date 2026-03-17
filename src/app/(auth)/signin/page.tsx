
"use server";

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

  console.log("Session user:", session?.user);
  // console.log("🔐 Server-side session:", session);


  if (session?.user) {
    redirect(callbackUrl);
  }
  return (
    <>
      <div>
        <p>You are not Signed In</p>
        <SignInButton callbackUrl={callbackUrl} />
      </div>
    </>
  );
}
