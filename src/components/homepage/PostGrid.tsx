import { PostWithCategory } from "@/types/PostViewType";
import Link from "next/link";

interface PostGridProps {
  posts: PostWithCategory[];
}
export default function PostGrid({ posts }: PostGridProps) {
  return (
    <section className="px-4">
      <h2 className="text-2xl font-semibold mb-4">Posts</h2>
      <section className="px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post._id} className="border rounded-lg p-4 bg-white">
            {post.image && <img src={post.image} alt={post.title} className="mb-2 h-48 w-full object-cover rounded" />}
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