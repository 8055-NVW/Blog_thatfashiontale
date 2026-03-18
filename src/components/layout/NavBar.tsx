"use client"

import Link from "next/link";
import { useSession } from "next-auth/react";
import { SignOutButton } from "@/components/SignOutButton";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function NavBar() {
    const { data: session, status } = useSession();
    const isSignedIn = Boolean(session?.user);

    return (
        <header className="sticky top-0 z-20 border-b border-border/80 bg-surface-muted/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 md:px-8">
                <Link href="/" className="shrink-0">
                    <p className="text-xs uppercase tracking-[0.3em] text-fg-muted">That Fashion Tale</p>
                    <p className="text-lg font-semibold text-fg">Stories in style, travel, and everyday life</p>
                </Link>

                <div className="flex items-center gap-4 md:gap-6">
                    <nav className="flex items-center gap-3 text-sm font-medium text-fg-muted md:gap-6">
                        <Link href="/" className="transition hover:text-fg">Home</Link>
                        <Link href="/#browse-posts" className="transition hover:text-fg">Browse by Category</Link>
                        <Link href="/#featured-post" className="transition hover:text-fg">Featured</Link>
                    </nav>

                    <ThemeToggle />

                    {status === "loading" ? null : isSignedIn ? (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/account"
                                className="rounded-full border border-border px-3 py-1.5 text-sm font-medium text-fg-muted transition hover:border-border-strong hover:text-fg"
                            >
                                Account
                            </Link>
                            <SignOutButton className="rounded-full border border-border px-3 py-1.5 text-sm font-medium text-fg-muted transition hover:border-border-strong hover:text-fg" />
                        </div>
                    ) : (
                        <Link
                            href="/signin?callbackUrl=/account"
                            className="rounded-full border border-border px-3 py-1.5 text-sm font-medium text-fg-muted transition hover:border-border-strong hover:text-fg"
                        >
                            Sign in
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
