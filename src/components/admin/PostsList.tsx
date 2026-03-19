"use client";

import AdminNotice from "./AdminNotice";
import PublicConfirmDialog from "@/components/post-interactions/PublicConfirmDialog";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PostWithCategory } from "@/types/PostViewType";
import { deletePost, getPosts } from "@/lib/api/posts";
import { extractApiMessage } from "@/lib/adminFeedback";

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
    const [notice, setNotice] = useState<string | null>(null)
    const [pendingDeletePost, setPendingDeletePost] = useState<PostWithCategory | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const fetchPosts = useCallback(async () => {
        try {
            const data = await getPosts({ categoryId })
            setPosts(data.posts || []);
            setError(null);
            setNotice(null);
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

    const handleDelete = async () => {
        if (!pendingDeletePost || isDeleting) return;

        setIsDeleting(true);
        try {
            const res = await deletePost(pendingDeletePost._id);
            const payload = await res.json().catch(() => null);
            if (res.ok) {
                setPosts(prev => prev.filter(p => p._id !== pendingDeletePost._id));
                setNotice(`Deleted “${pendingDeletePost.title}”.`);
                setPendingDeletePost(null);
            } else {
                setError(extractApiMessage(payload, "Failed to delete post."));
            }
        } catch (err) {
            setError(getErrorMessage(err));
            console.error("Delete error:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return <AdminNotice message="Loading posts..." />;
    }

    if (error) {
        return <AdminNotice tone="error" message={error} />;
    }

    return (
        <div className="space-y-4">
            {notice ? <AdminNotice tone="success" message={notice} /> : null}
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
                        <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold text-fg">{post.title}</h3>
                            <p className="mb-1 break-words text-sm text-fg-muted">
                                {post.slug} — {post.category?.name}
                            </p>
                            <p className="text-fg">{post.content.slice(0, 100)}...</p>
                        </div>
                        <div className="grid w-full gap-2 sm:w-auto sm:flex sm:flex-col">
                            <button
                                className="btn-secondary w-full sm:w-auto"
                                onClick={() => router.push(`/admin/posts/${post._id}`)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn-danger w-full sm:w-auto"
                                onClick={() => {
                                    setError(null);
                                    setNotice(null);
                                    setPendingDeletePost(post);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
            {pendingDeletePost ? (
                <PublicConfirmDialog
                    title="Delete this post?"
                    description={`This will remove “${pendingDeletePost.title}” from the archive. This action cannot be undone.`}
                    confirmLabel="Delete post"
                    isSubmitting={isDeleting}
                    onConfirm={handleDelete}
                    onClose={() => {
                        if (!isDeleting) {
                            setPendingDeletePost(null);
                        }
                    }}
                />
            ) : null}
        </div>
    )
}
