import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin?callbackUrl=/admin");
  }

  if (!session.user.is_superuser) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
