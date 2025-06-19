'use client';

import PostForm from "@/components/admin/PostForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api/categories";
import { CategoryWithId } from "@/types/CategoryType";
import { PostFormType } from "@/types/PostType";

export default function CreatePostPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [categories, setCategories] = useState<CategoryWithId[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
        fetchCategories();
    }, []);

    const handleCreatePost = async (form: PostFormType, categoryId: string) => {
    if (!session?.user?.id) {
      alert("Missing user ID.");
      return;
    }
    const queryParams = new URLSearchParams({
      userId: session.user.id,
      categoryId,
    });
    const res = await fetch(`/api/posts?${queryParams.toString()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      const errorData = await res.json();
      alert("Failed to create post: " + errorData.message);
    }
  };

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
        />
    );
}