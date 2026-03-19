import { PostWithCategory } from "@/types/PostViewType";
import Image from "next/image";
import Link from "next/link";

interface FeaturedProps {
  posts: PostWithCategory[]
}

export default function Featured({ posts }: FeaturedProps) {
  const post = posts[0];
  if (!posts || posts.length === 0) {
    return null;
  }

  const publishedDate = post.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(post.createdAt))
    : null;

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.3em] text-fg-subtle">Featured</p>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-fg md:text-3xl">Start with one standout story</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-fg-muted md:text-base">
              A highlighted entry point into the archive with room for image, context, and a longer introduction.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-soft)]">
        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            width={1200}
            height={900}
            className="h-80 w-full object-cover md:h-[30rem]"
          />
        )}

        <div className="grid gap-8 px-6 py-6 md:grid-cols-[minmax(0,1.15fr)_minmax(14rem,0.85fr)] md:px-8 md:py-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-fg-subtle">
              <span>{post.category?.name ?? "Post"}</span>
              {publishedDate ? <span>{publishedDate}</span> : null}
            </div>
            <h3 className="max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-fg md:text-[2.15rem] md:leading-[1.08]">
              {post.title}
            </h3>
            <p className="max-w-3xl text-base leading-7 text-fg-muted md:text-lg md:leading-8">
              {post.content.slice(0, 240)}{post.content.length > 240 ? "..." : ""}
            </p>
          </div>

          <div className="flex flex-col justify-between gap-5 rounded-lg border border-border bg-subtle p-5">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.24em] text-fg-subtle">Featured reading</p>
              <p className="text-sm leading-6 text-fg-muted">
                A slower entry point for readers who want one complete story before exploring the full archive.
              </p>
            </div>
            <Link
              href={`/posts/${post.slug}`}
              className="inline-flex w-fit items-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-fg transition hover:border-border-strong hover:bg-accent-soft"
            >
              Read story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
