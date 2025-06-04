'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const CreatePostPage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();


    const [form, setForm] = useState({
        title: "",
        slug: "",
        content: "",
        categoryId: "",
        image: "",
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetch("/api/categories");
            const data = await res.json();
            console.log(data)
            setCategories(data);
        };
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userId = session?.user?.id;
        if (!userId) {
            alert("User not logged in");
            return;
        }

        const res = await fetch(`/api/posts?categoryId=${form.categoryId}&userId=${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, hotspots: [] }), 
        });

        if (res.ok) {
            router.push("/posts");
        } else {
            alert("Failed to create post");
        }
    };

    if (status === "loading") return <p>Loading...</p>;
    if (status === "unauthenticated") return <p>Please log in</p>;
    if (!session?.user?.is_superuser) return <p>Unauthorized</p>;

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
            <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="input" required />
            <input name="slug" placeholder="Slug" value={form.slug} onChange={handleChange} className="input" required />
            <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} className="textarea" required />
            <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="input" required />

            <select name="categoryId" value={form.categoryId} onChange={handleChange} className="select" required>
                <option value="">Select Category</option>
                {categories.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
            </select>

            <button type="submit" className="btn">Create Post</button>
        </form>
    );
};

export default CreatePostPage;
