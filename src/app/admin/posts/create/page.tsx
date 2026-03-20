'use client';

import AdminNotice from "@/components/admin/AdminNotice";
import PostForm from "@/components/admin/PostForm";
import { extractApiMessage } from "@/features/admin/lib/adminFeedback";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api/categories";
import { CategoryWithId } from "@/types/CategoryType";
import { PostFormType } from "@/types/PostType";

export default function CreatePostPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<CategoryWithId[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [categoryError, setCategoryError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        setCategoryError(null);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setCategoryError("Could not load categories. You can retry below.");
      } finally {
        setLoadingCategories(false);
      }
    };
        fetchCategories();
    }, []);

    const handleCreatePost = async (form: PostFormType, categoryId: string) => {
    setIsSubmitting(true);
    setSubmitError(null);
    const queryParams = new URLSearchParams({ categoryId });
    try {
      const res = await fetch(`/api/posts?${queryParams.toString()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = await res.json().catch(() => null);

      if (res.ok) {
        router.push("/admin");
        return;
      }

      setSubmitError(extractApiMessage(payload, "Failed to create post."));
    } catch {
      setSubmitError("Failed to create post.");
    } finally {
      setIsSubmitting(false);
    }
   };

    if (loadingCategories) {
      return <div className="mx-auto max-w-5xl py-8"><AdminNotice message="Loading categories..." /></div>;
    }

    if (categoryError) {
      return (
        <div className="mx-auto max-w-5xl space-y-4 py-8">
          <AdminNotice tone="error" message={categoryError} />
          <button type="button" className="btn-secondary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      );
    }

    return (
        <PostForm
            initialForm={{
                title: "",
                slug: "",
                content: "",
                image: "",
                user: "",
                category: "",
                hotspots: [],
            }}
            categories={categories}
            submitLabel="Create"
            onSubmit={handleCreatePost}
            isSubmitting={isSubmitting}
            submitError={submitError}
        />
    );
}
