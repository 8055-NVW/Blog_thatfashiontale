import { auth } from "@/auth";
import connect from "@/lib/mongoose";
import Like from "@/models/Like";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Types } from "mongoose";

type SavedPost = {
  id: string;
  title: string;
  slug: string;
  image?: string;
};

type PopulatedPost = {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  image?: string;
};

function isPopulatedPost(value: unknown): value is PopulatedPost {
  if (!value || typeof value !== "object") {
    return false;
  }

  return "_id" in value && "title" in value && "slug" in value;
}

async function getSavedPosts(userId: string): Promise<SavedPost[]> {
  await connect();

  const likes = await Like.find({
    user: new Types.ObjectId(userId),
    post: { $type: "objectId" },
    $or: [{ comment: null }, { comment: { $exists: false } }],
  })
    .sort({ createdAt: -1 })
    .populate("post", "title slug image");

  return likes
    .map((like) => like.post)
    .filter(isPopulatedPost)
    .map((post) => ({
      id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      image: post.image,
    }));
}

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=/account");
  }

  const savedPosts = await getSavedPosts(session.user.id);

  return (
    <div className="content-wide-container space-y-8 px-4 py-10 md:space-y-10 md:py-14">
      <section className="rounded-xl border border-border bg-surface px-6 py-7 shadow-[var(--shadow-soft)] md:px-8 md:py-8">
        <p className="text-[11px] uppercase tracking-[0.28em] text-fg-subtle">Account</p>
        <div className="mt-4 flex items-center gap-4 md:gap-5">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "User avatar"}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-subtle text-lg font-semibold text-fg-muted">
              {(session.user.name ?? session.user.email ?? "U").charAt(0).toUpperCase()}
            </div>
          )}

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-[-0.02em] text-fg md:text-3xl">
              {session.user.name ?? "Signed-in user"}
            </h1>
            <p className="text-sm text-fg-muted">{session.user.email ?? "No email available"}</p>
            <p className="max-w-2xl text-sm leading-6 text-fg-muted md:text-base md:leading-7">
              A private reading space for the stories you save and want to return to later.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface px-6 py-7 shadow-[var(--shadow-soft)] md:px-8 md:py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-fg-subtle">Saved reading</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-fg">Saved posts</h2>
            <p className="mt-2 text-sm leading-6 text-fg-muted md:text-base">
              Posts you save appear here in a calm, easy-to-return reading list.
            </p>
          </div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-fg-subtle">{savedPosts.length} saved</p>
        </div>

        {savedPosts.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-border bg-subtle px-6 py-10 text-center shadow-[var(--shadow-soft)]">
            <h3 className="text-lg font-medium text-fg">No saved posts yet</h3>
            <p className="mt-2 text-sm leading-6 text-fg-muted">
              Save a post and it will show up here.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-fg transition hover:border-border-strong hover:bg-accent-soft"
            >
              Browse posts
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {savedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="group flex items-center gap-4 rounded-lg border border-border bg-subtle p-4 transition hover:border-border-strong hover:bg-accent-soft/60"
              >
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={112}
                    height={112}
                    className="h-24 w-24 rounded-lg border border-border object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-[11px] uppercase tracking-[0.22em] text-fg-subtle">
                    Post
                  </div>
                )}

                <div className="min-w-0 space-y-2">
                  <p className="text-lg font-medium leading-7 text-fg md:text-xl">{post.title}</p>
                  <p className="text-sm text-fg-muted transition group-hover:text-fg">Open saved post</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
