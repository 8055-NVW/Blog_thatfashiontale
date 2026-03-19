import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminShellHeader from "@/components/admin/AdminShellHeader";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin?callbackUrl=/admin");
  }

  if (!session.user.is_superuser) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-canvas px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto max-w-6xl">
        <AdminShellHeader userName={session.user.name ?? session.user.email ?? null} />
        <main>{children}</main>
      </div>
    </div>
  );
}
