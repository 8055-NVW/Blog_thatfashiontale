"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PostWithCategory } from "@/types/PostViewType";
import { deletePost, getPosts } from "@/lib/api/posts";

type Props = {
    categoryId?: string;
};

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Unknown error";
}

export default function PostsList({ categoryId }: Props) {
    const [posts, setPosts] = useState<PostWithCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)
    const router = useRouter();

    const fetchPosts = useCallback(async () => {
        try {
            const data = await getPosts({ categoryId })
            setPosts(data.posts || []);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch posts", err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false)
        }
    }, [categoryId]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleDelete = async (postId: string) => {
        if (!confirm("Delete this post?")) return;

        try {
            const res = await deletePost(postId);
            if (res.ok) {
                setPosts(prev => prev.filter(p => p._id !== postId));
            } else {
                alert("Failed to delete post.");
            }
        } catch (err) {
            setError(getErrorMessage(err));
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
                className="btn-primary"
                onClick={() => router.push("/admin/posts/create")}
            >
                + Add Post
            </button>
            {posts.length === 0 ? (
                <div className="admin-card px-5 py-6 text-sm text-fg-muted">No posts found{categoryId ? " for this category" : ""}.</div>
            ) : (
                posts.map(post => (
                    <div
                        key={post._id}
                        className="admin-card flex flex-col gap-4 p-4 sm:flex-row sm:items-start"
                    >
                        {post.image && (
                            // eslint-disable-next-line @next/next/no-img-element -- Admin list previews arbitrary remote post images.
                            <img
                                src={post.image}
                                alt={post.title}
                                className="h-24 w-full rounded-lg border border-border object-cover sm:w-24"
                            />
                        )}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-fg">{post.title}</h3>
                            <p className="mb-1 text-sm text-fg-muted">
                                {post.slug} — {post.category?.name}
                            </p>
                            <p className="text-fg">{post.content.slice(0, 100)}...</p>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:flex-col">
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
