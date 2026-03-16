import { PostWithCategory } from "@/types/PostViewType";
import Link from "next/link";

interface PostGridProps {
  posts: PostWithCategory[];
  selectedCategoryName?: string | null;
}

export default function PostGrid({ posts, selectedCategoryName = null }: PostGridProps) {
  const heading = selectedCategoryName ? `${selectedCategoryName} Stories` : "Latest Stories";

  if (posts.length === 0) {
    return (
      <section className="px-4">
        <h2 className="mb-4 text-2xl font-semibold">{heading}</h2>
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-gray-600">
          <p className="text-lg font-medium text-gray-900">No posts to show yet.</p>
          <p className="mt-2 text-sm">
            {selectedCategoryName
              ? `Try another category or clear the filter to keep browsing.`
              : "Check back soon for new stories."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{heading}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {selectedCategoryName
              ? `A focused reading list for ${selectedCategoryName.toLowerCase()}.`
              : "Fresh writing from across the blog."}
          </p>
        </div>
        <p className="text-sm text-gray-500">{posts.length} post{posts.length === 1 ? "" : "s"}</p>
      </div>
      <section className="px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post._id} className="border rounded-lg p-4 bg-white">
            {post.image && <img src={post.image} alt={post.title} className="mb-2 h-48 w-full object-cover rounded" />}
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{post.category?.name ?? "Post"}</p>
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="text-sm text-gray-600">{post.content.slice(0, 100)}...</p>
            <Link href={`/posts/${post.slug}`} className="text-blue-600 text-sm mt-2 inline-block">
              Read more →
            </Link>
          </div>
        ))}
      </section>
    </section>
  );
}
