"use client"

import Link from "next/link";
import { useSession } from "next-auth/react";
import { SignOutButton } from "@/components/SignOutButton";

export default function NavBar() {
    const { data: session, status } = useSession();
    const isSignedIn = Boolean(session?.user);

    return (
        <header className="sticky top-0 z-20 border-b border-black/5 bg-[#f1e3e4]/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 md:px-8">
                <Link href="/" className="shrink-0">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-600">That Fashion Tale</p>
                    <p className="text-lg font-semibold text-gray-900">Stories in style, travel, and everyday life</p>
                </Link>

                <div className="flex items-center gap-4 md:gap-6">
                    <nav className="flex items-center gap-3 text-sm font-medium text-gray-700 md:gap-6">
                        <Link href="/" className="transition hover:text-gray-950">Home</Link>
                        <Link href="/#browse-posts" className="transition hover:text-gray-950">Browse by Category</Link>
                        <Link href="/#featured-post" className="transition hover:text-gray-950">Featured</Link>
                    </nav>

                    {status === "loading" ? null : isSignedIn ? (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/account"
                                className="rounded-full border border-black/10 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-black/20 hover:text-gray-900"
                            >
                                Account
                            </Link>
                            <SignOutButton className="rounded-full border border-black/10 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-black/20 hover:text-gray-900" />
                        </div>
                    ) : (
                        <Link
                            href="/signin?callbackUrl=/account"
                            className="rounded-full border border-black/10 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-black/20 hover:text-gray-900"
                        >
                            Sign in
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
