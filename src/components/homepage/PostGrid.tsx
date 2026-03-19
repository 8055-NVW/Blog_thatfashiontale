import { PostWithCategory } from "@/types/PostViewType";
import Image from "next/image";
import Link from "next/link";

interface PostGridProps {
  posts: PostWithCategory[];
  selectedCategoryName?: string | null;
}

export default function PostGrid({ posts, selectedCategoryName = null }: PostGridProps) {
  const heading = selectedCategoryName ? `${selectedCategoryName} Stories` : "Latest Stories";

  function formatDate(date?: Date) {
    if (!date) {
      return null;
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  }

  if (posts.length === 0) {
    return (
      <section className="space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-fg md:text-3xl">{heading}</h2>
            <p className="mt-2 text-sm leading-6 text-fg-muted md:text-base">
              {selectedCategoryName
                ? `A focused reading list for ${selectedCategoryName.toLowerCase()}.`
                : "A spacious overview of the latest writing across the site."}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-10 text-center text-fg-muted shadow-[var(--shadow-soft)]">
          <p className="text-lg font-medium text-fg">No posts to show yet.</p>
          <p className="mt-2 text-sm leading-6">
            {selectedCategoryName
              ? `Try another category or clear the filter to keep browsing.`
              : "Check back soon for new stories."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-fg md:text-3xl">{heading}</h2>
          <p className="mt-2 text-sm leading-6 text-fg-muted md:text-base">
            {selectedCategoryName
              ? `A focused reading list for ${selectedCategoryName.toLowerCase()}.`
              : "Fresh writing from across the blog, presented as a calm editorial archive."}
          </p>
        </div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-fg-subtle">{posts.length} post{posts.length === 1 ? "" : "s"}</p>
      </div>

      <section className="grid grid-cols-1 gap-6 pt-2 sm:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post._id}
            className="group overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
          >
            <Link href={`/posts/${post.slug}`} className="block">
              <div className="space-y-0">
                {post.image ? (
                  <div className="overflow-hidden border-b border-border bg-subtle">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={960}
                      height={1280}
                      className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[4/5] items-end border-b border-border bg-subtle p-5">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-fg-subtle">{post.category?.name ?? "Post"}</p>
                  </div>
                )}

                <div className="space-y-4 p-5 md:p-6">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-fg-subtle">
                    <span>{post.category?.name ?? "Post"}</span>
                    {formatDate(post.createdAt) ? <span>{formatDate(post.createdAt)}</span> : null}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold leading-8 tracking-[-0.02em] text-fg">
                      {post.title}
                    </h3>
                    <p className="text-sm leading-7 text-fg-muted md:text-base">
                      {post.content.slice(0, 140)}{post.content.length > 140 ? "..." : ""}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 text-sm font-medium text-fg-muted transition group-hover:text-fg">
                    <span>Read story</span>
                    <span aria-hidden="true">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </section>
    </section>
  );
}
