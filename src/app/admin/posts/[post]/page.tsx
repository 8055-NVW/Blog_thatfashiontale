"use client"

import PostForm from "@/components/admin/PostForm";
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

    useEffect(() => {
        const fetchData = async () => {
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
            }
        };
        if (postId) fetchData();

    }, [postId])

    const handleUpdatePost = async (updatedForm: PostFormType) => {
        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedForm),
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert("Failed to update post: " + errorData.message);
                return;
            }

            router.push("/admin");
        } catch (err) {
            alert("Failed to update post.");
            console.error(err);
        }
    };

    if (!form) return <p>Loading...</p>;

    return (
        <PostForm
            initialForm={form}
            categories={categories}
            submitLabel="Edit"
            onSubmit={handleUpdatePost}
        />
    )
}
