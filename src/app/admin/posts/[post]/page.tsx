"use client"

import AdminNotice from "@/components/admin/AdminNotice";
import PostForm from "@/components/admin/PostForm";
import { extractApiMessage } from "@/features/admin/lib/adminFeedback";
import { getCategories } from "@/lib/api/categories";
import { getPost } from "@/lib/api/posts";
import { CategoryWithId } from "@/types/CategoryType";
import { PostFormType } from "@/types/PostType";
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react";

export default function EditPostPage() {
    const { post: postId } = useParams();
    const router = useRouter();
    const [form, setForm] = useState<PostFormType | undefined>(undefined);
    const [categories, setCategories] = useState<CategoryWithId[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setLoadError(null);
            try {
                const post = await getPost(postId as string);
                const categoryData = await getCategories();

                const normalizedPost: PostFormType = {
                    ...post,
                    category: typeof post.category === "object" ? post.category._id : post.category,
                };
                setForm(normalizedPost);
                setCategories(categoryData);
            } catch (error) {
                console.error("Failed to load post or categories", error);
                setLoadError("Could not load this post editor. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        if (postId) fetchData();

    }, [postId])

    const handleUpdatePost = async (updatedForm: PostFormType, categoryId: string) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...updatedForm, category: categoryId }),
            });

            const payload = await res.json().catch(() => null);

            if (!res.ok) {
                setSubmitError(extractApiMessage(payload, "Failed to update post."));
                return;
            }

            router.push("/admin");
        } catch (err) {
            console.error(err);
            setSubmitError("Failed to update post.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="mx-auto max-w-5xl py-8"><AdminNotice message="Loading post editor..." /></div>;

    if (loadError) {
        return (
            <div className="mx-auto max-w-5xl space-y-4 py-8">
                <AdminNotice tone="error" message={loadError} />
                <div className="flex flex-wrap gap-2">
                    <button type="button" className="btn-secondary" onClick={() => window.location.reload()}>
                        Retry
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => router.push("/admin") }>
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!form) return <div className="mx-auto max-w-5xl py-8"><AdminNotice tone="error" message="Post data is unavailable." /></div>;

    return (
        <PostForm
            initialForm={form}
            categories={categories}
            submitLabel="Edit"
            onSubmit={handleUpdatePost}
            isSubmitting={isSubmitting}
            submitError={submitError}
        />
    )
}
