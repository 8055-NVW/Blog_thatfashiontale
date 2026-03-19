"use client"

import Link from "next/link";
import { useSession } from "next-auth/react";
import { SignOutButton } from "@/components/SignOutButton";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function NavBar() {
    const { data: session, status } = useSession();
    const isSignedIn = Boolean(session?.user);
    const isAdmin = Boolean(session?.user?.is_superuser);

    return (
        <header className="sticky top-0 z-20 border-b border-border bg-canvas shadow-[var(--shadow-soft)]">
            <div className="shell-container flex items-center justify-between gap-6 py-3 md:py-4">
                <Link href="/" className="min-w-0 shrink-0 space-y-1">
                    <p className="text-[11px] uppercase tracking-[0.32em] text-fg-subtle">That Fashion Tale</p>
                    <div className="flex items-baseline gap-3">
                        <p className="text-base font-semibold text-fg md:text-lg">Stories in style, travel, and everyday life</p>
                        <span className="hidden text-sm text-fg-subtle md:inline">A personal editorial archive</span>
                    </div>
                </Link>

                <div className="flex items-center gap-3 md:gap-4">
                    <nav className="flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.16em] text-fg-muted md:gap-4 md:text-[13px]">
                        <Link href="/" className="hidden transition hover:text-fg sm:inline-flex">Home</Link>
                        <Link href="/#browse-posts" className="transition hover:text-fg">Archive</Link>
                        <Link href="/#featured-post" className="hidden transition hover:text-fg lg:inline-flex">Featured</Link>
                    </nav>

                    <div className="flex items-center gap-2 border-l border-border pl-3 md:pl-4">
                        <ThemeToggle />

                        {status === "loading" ? null : isSignedIn ? (
                            <div className="flex items-center gap-2">
                                {isAdmin ? (
                                    <Link
                                        href="/admin"
                                        className="hidden rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-fg-muted transition hover:border-border-strong hover:text-fg md:inline-flex"
                                    >
                                        Admin
                                    </Link>
                                ) : null}
                                <Link
                                    href="/account"
                                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-fg-muted transition hover:border-border-strong hover:text-fg"
                                >
                                    Account
                                </Link>
                                <SignOutButton className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-fg-muted transition hover:border-border-strong hover:text-fg" />
                            </div>
                        ) : (
                            <Link
                                href="/signin?callbackUrl=/account"
                                className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-fg-muted transition hover:border-border-strong hover:text-fg"
                            >
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
