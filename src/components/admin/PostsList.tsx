"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PostWithCategory } from "@/types/PostViewType";
import { deletePost, getPosts } from "@/lib/api/posts";

type Props = {
    categoryId?: string;
};

export default function PostsList({ categoryId }: Props) {
    const [posts, setPosts] = useState<PostWithCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const router = useRouter();

    const fetchPosts = async () => {
        try {
            const data = await getPosts({ categoryId })
            setPosts(data.posts || []);
        } catch (err) {
            console.error("Failed to fetch posts", err);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [categoryId]);

    const handleDelete = async (postId: string) => {
        if (!confirm("Delete this post?")) return;

        try {
            const res = await deletePost(postId);
            if (res.ok) {
                setPosts(prev => prev.filter(p => p._id !== postId));
            } else {
                alert("Failed to delete post.");
            }
        } catch (err: any) {
            setError(err.message);
            console.error("Delete error:", err);
        }
    };

    if (loading) {
        return <p>Loading posts...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="space-y-4">
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => router.push("/admin/posts/create")}
            >
                + Add Post
            </button>
            {posts.length === 0 ? (
                <p>No posts found{categoryId ? " for this category" : ""}.</p>
            ) : (
                posts.map(post => (
                    <div
                        key={post._id}
                        className="flex items-start gap-4 border p-4 rounded-md"
                    >
                        {post.image && (
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-24 h-24 object-cover rounded"
                            />
                        )}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold">{post.title}</h3>
                            <p className="text-sm text-gray-600 mb-1">
                                {post.slug} — {post.category?.name}
                            </p>
                            <p className="text-gray-800">{post.content.slice(0, 100)}...</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                className="btn-secondary"
                                onClick={() => router.push(`/admin/posts/${post._id}`)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn-danger"
                                onClick={() => handleDelete(post._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}
