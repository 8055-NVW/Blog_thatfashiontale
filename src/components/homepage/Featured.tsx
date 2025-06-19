import { PostWithCategory } from "@/types/PostViewType";
import Link from "next/link";

interface FeaturedProps {
  posts: PostWithCategory[]
}

export default function Featured({ posts }: FeaturedProps) {
  const post = posts[0];
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="px-4">
      <h2 className="text-2xl font-semibold mb-4">Featured Post</h2>
      <div className="bg-white rounded-md shadow-md overflow-hidden">
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2">{post.title}</h3>
          <p className="text-gray-600 line-clamp-3">{post.content}</p>
          <Link href={`/posts/${post._id}`} className="text-blue-600 mt-2 inline-block">
            Read more →
          </Link>
        </div>
      </div>
    </section>
  );
}