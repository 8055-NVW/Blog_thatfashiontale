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
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 md:px-8">
      <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Account</p>
        <div className="mt-4 flex items-center gap-4">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "User avatar"}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-gray-600">
              {(session.user.name ?? session.user.email ?? "U").charAt(0).toUpperCase()}
            </div>
          )}

          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-900">
              {session.user.name ?? "Signed-in user"}
            </h1>
            <p className="text-sm text-gray-600">{session.user.email ?? "No email available"}</p>
            <p className="text-sm text-gray-500">Private account page</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Saved posts</h2>
            <p className="text-sm text-gray-600">Posts you save appear here.</p>
          </div>
          <p className="text-sm text-gray-500">{savedPosts.length} saved</p>
        </div>

        {savedPosts.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center">
            <h3 className="text-base font-medium text-gray-900">No saved posts yet</h3>
            <p className="mt-2 text-sm text-gray-600">
              Save a post and it will show up here.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-100"
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
                className="flex items-center gap-4 rounded-2xl border border-black/10 p-4 transition hover:bg-gray-50"
              >
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={88}
                    height={88}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs uppercase tracking-[0.2em] text-gray-500">
                    Post
                  </div>
                )}

                <div className="min-w-0">
                  <p className="text-lg font-medium text-gray-900">{post.title}</p>
                  <p className="mt-1 text-sm text-gray-500">Open post</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
