'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Post {
    _id: string;
    title: string;
    slug: string;
    content: string;
    image: string;
}

export default function AdminPostPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [posts, setPosts] = useState<Post[]>([]);
    const [form, setForm] = useState({ title: "", slug: "", content: "", image: "" });
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchPosts = async () => {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(data.posts);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = (post: Post) => {
        setForm({ title: post.title, slug: post.slug, content: post.content, image: post.image });
        setEditingId(post._id);
    };

    const handleDelete = async (id: string) => {
        const res = await fetch("/api/posts", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId: id }),
        });
        if (res.ok) {
            await fetchPosts();
        } else {
            alert("Failed to delete post");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingId ? "PATCH" : "POST";
        const payload = editingId
            ? { postId: editingId, ...form }
            : form;

        const res = await fetch("/api/posts", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            await fetchPosts();
            setForm({ title: "", slug: "", content: "", image: "" });
            setEditingId(null);
        } else {
            alert("Failed to save post");
        }
    };

    if (status === "loading") return <p>Loading...</p>;
    if (!session?.user?.is_superuser) return <p>Unauthorized</p>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="input" required />
                <input name="slug" placeholder="Slug" value={form.slug} onChange={handleChange} className="input" required />
                <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} className="textarea" required />
                <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="input" required />
                <button type="submit" className="btn">{editingId ? "Update" : "Create"} Post</button>
            </form>

            <ul className="space-y-2">
                {posts.map(post => (
                    <li key={post._id} className="border p-4">
                        <h3 className="font-bold">{post.title}</h3>
                        <p>{post.slug}</p>
                        <p>{post.content}</p>
                        <div className="flex space-x-2 mt-2">
                            <button onClick={() => handleEdit(post)} className="btn">Edit</button>
                            <button onClick={() => handleDelete(post._id)} className="btn bg-red-500">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
