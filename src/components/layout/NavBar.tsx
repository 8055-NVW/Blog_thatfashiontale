"use client"

import Link from "next/link";
import { useSession } from "next-auth/react";
import { SignOutButton } from "@/components/SignOutButton";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function NavBar() {
    const { data: session, status } = useSession();
    const isSignedIn = Boolean(session?.user);
    const isAdmin = Boolean(session?.user?.is_superuser);
    const utilityButtonClass = "inline-flex min-h-10 items-center justify-center rounded-full border border-border bg-surface px-3 py-2 text-sm font-medium text-fg-muted transition hover:border-border-strong hover:text-fg";

    return (
        <header className="sticky top-0 z-20 border-b border-border bg-canvas shadow-[var(--shadow-soft)]">
            <div className="shell-container py-3 md:py-4">
                <div className="flex flex-col gap-3 md:gap-4">
                    <Link href="/" className="min-w-0 space-y-1">
                        <p className="text-[11px] uppercase tracking-[0.32em] text-fg-subtle">That Fashion Tale</p>
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <p className="text-base font-semibold text-fg md:text-lg">Stories in style, travel, and everyday life</p>
                            <span className="hidden text-sm text-fg-subtle xl:inline">A personal editorial archive</span>
                        </div>
                    </Link>

                    <div className="flex flex-col gap-3 border-t border-border/70 pt-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between md:pt-4">
                        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-medium uppercase tracking-[0.16em] text-fg-muted md:text-[13px]">
                            <Link href="/" className="transition hover:text-fg">Home</Link>
                            <Link href="/#browse-posts" className="transition hover:text-fg">Archive</Link>
                            <Link href="/#featured-post" className="transition hover:text-fg">Featured</Link>
                        </nav>

                        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                            <ThemeToggle />

                            {status === "loading" ? null : isSignedIn ? (
                                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                    {isAdmin ? (
                                        <Link
                                            href="/admin"
                                            className={utilityButtonClass}
                                        >
                                            Admin
                                        </Link>
                                    ) : null}
                                    <Link
                                        href="/account"
                                        className={utilityButtonClass}
                                    >
                                        Account
                                    </Link>
                                    <SignOutButton className={utilityButtonClass} />
                                </div>
                            ) : (
                                <Link
                                    href="/signin?callbackUrl=/account"
                                    className={utilityButtonClass}
                                >
                                    Sign in
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
