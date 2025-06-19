
"use server";

import { SignInButton } from "@/components/SignInButton";
import { auth } from "@/auth";
import Image from "next/image";
import { SignOutButton } from "@/components/SignOutButton";

export default async function Home() {
  const session = await auth();

  console.log("Session user:", session?.user);
  // console.log("🔐 Server-side session:", session);


  if (session?.user) {
    return (
      <div>
        <h1>Learning login</h1>
        <p>User signed in with name: {session.user.name}</p>
        <p>User signed in with email: {session.user.email}</p>
        {session.user.image && <Image
          src={session.user.image}
          alt={session?.user?.name ?? "Avatar"}
          width={45}
          height={45}
          style={{ borderRadius: "50%" }}
        />}
        <SignOutButton />
      </div>
    );
  }
  return (
    <>
      <div>
        <p>You are not Signed In</p>
        <SignInButton />
      </div>
    </>
  );
}
