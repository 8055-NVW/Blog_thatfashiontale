'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api/categories";
import { CategoryWithId } from "@/types/CategoryType";

export default function CreatePostPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [form, setForm] = useState({
        title: "",
        slug: "",
        content: "",
        image: "",
        hotspots: []
    });

    const [categories, setCategories] = useState<CategoryWithId[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
                if (data.length > 0) setSelectedCategoryId(data[0]._id);
            } catch (err) {
                console.error("Error loading categories:", err);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.id || !selectedCategoryId) {
            alert("Missing user ID or category.");
            return;
        }

        setSubmitting(true);
        const queryParams = new URLSearchParams({
            userId: session.user.id,
            categoryId: selectedCategoryId
        });

        const res = await fetch(`/api/posts?${queryParams.toString()}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        setSubmitting(false);

        if (res.ok) {
            router.push("/admin");
        } else {
            const errorData = await res.json();
            alert("Failed to create post: " + errorData.message);
        }
    };

    if (status === "loading") return <p>Loading...</p>;
    if (!session?.user?.is_superuser) return <p>Unauthorized</p>;

    return (
        <div className="max-w-5xl mx-auto space-y-6 py-8">
            <h2 className="text-2xl font-bold">Create New Post</h2>

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">

                <div className="flex-1 space-y-4">
                    {form.image && (
                        <img
                            src={form.image}
                            alt="PostPreview"
                            className="w-full rounded shadow"
                        />
                    )}
                    <button
                        type="button"
                        className="border border-dashed border-gray-400 px-4 py-2 rounded text-sm"
                        onClick={() => alert("Hotspot functionality coming soon!")}
                    >
                        + Add Hotspot
                    </button>
                </div>

                <div className="flex-1 space-y-4">
                    <input
                        name="title"
                        placeholder="Title"
                        value={form.title}
                        onChange={handleChange}
                        className="input w-full"
                        required
                    />
                    <input
                        name="slug"
                        placeholder="Slug"
                        value={form.slug}
                        onChange={handleChange}
                        className="input w-full"
                        required
                    />
                    <textarea
                        name="content"
                        placeholder="Content"
                        value={form.content}
                        onChange={handleChange}
                        className="textarea w-full"
                        rows={6}
                        required
                    />
                    <input
                        name="image"
                        placeholder="Image URL"
                        value={form.image}
                        onChange={handleChange}
                        className="input w-full"
                        required
                    />

                    <select
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={submitting}
                    >
                        {submitting ? "Saving..." : "Create Post"}
                    </button>
                </div>
            </form>
        </div>
    );
}