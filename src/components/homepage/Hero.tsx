"use client"

type HeroProps = {
    postCount: number;
    categoryCount: number;
}

export default function Hero({ postCount, categoryCount }: HeroProps){
    return(
        <section className="grid gap-8 rounded-xl border border-border bg-surface px-6 py-10 shadow-[var(--shadow-soft)] md:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] md:px-10 md:py-12">
            <div className="space-y-5">
                <p className="meta-label tracking-[0.32em]">Editorial archive</p>
                <div className="space-y-4">
                    <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.03em] text-fg md:text-5xl md:leading-[1.05]">
                        A calm collection of style, travel, and everyday stories.
                    </h1>
                    <p className="max-w-2xl text-base leading-7 text-fg-muted md:text-lg md:leading-8">
                        Browse featured writing, explore by category, and move through the archive at an unhurried pace.
                    </p>
                </div>
            </div>

            <div className="grid gap-3 self-end sm:grid-cols-2 md:grid-cols-1">
                <div className="rounded-lg border border-border bg-subtle px-4 py-4">
                    <p className="meta-label">Published</p>
                    <p className="mt-2 text-2xl font-semibold text-fg">{postCount}</p>
                    <p className="mt-1 text-sm text-fg-muted">Stories currently in the archive.</p>
                </div>
                <div className="rounded-lg border border-border bg-subtle px-4 py-4">
                    <p className="meta-label">Categories</p>
                    <p className="mt-2 text-2xl font-semibold text-fg">{categoryCount}</p>
                    <p className="mt-1 text-sm text-fg-muted">Topics for focused reading.</p>
                </div>
            </div>
        </section>
    )
}
