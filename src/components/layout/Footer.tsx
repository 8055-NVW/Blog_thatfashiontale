import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-16 border-t border-border bg-subtle">
            <div className="shell-container flex flex-col gap-6 py-8 md:flex-row md:items-end md:justify-between md:py-10">
                <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-fg-subtle">That Fashion Tale</p>
                    <p className="max-w-xl text-sm leading-6 text-fg-muted">
                        A quiet editorial home for style, travel, and everyday notes, designed for calm browsing in light and dark mode.
                    </p>
                </div>

                <div className="space-y-3 text-sm text-fg-muted md:text-right">
                    <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-end">
                        <Link href="/" className="transition hover:text-fg">Home</Link>
                        <Link href="/#browse-posts" className="transition hover:text-fg">Archive</Link>
                        <Link href="/#featured-post" className="transition hover:text-fg">Featured</Link>
                        <Link href="/signin?callbackUrl=/account" className="transition hover:text-fg">Sign in</Link>
                    </nav>
                    <p className="text-xs uppercase tracking-[0.18em] text-fg-subtle">© 2025 That Fashion Tale</p>
                </div>
            </div>
        </footer>
    )
}
