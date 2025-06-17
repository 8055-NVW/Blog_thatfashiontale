"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { addOrUpdateCategory, deleteCategory, getCategories } from "@/lib/api/categories";

type Category = {
    _id: string;
    name: string;
    slug: string;
    description: string;
};

export default function CategoryDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [form, setForm] = useState({ name: "", slug: "", description: "" });
    const [editingId, setEditingId] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err: any) {
                console.error("Failed to fetch categories:", err.message);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addOrUpdateCategory(form, editingId, categories);
            const updated = await getCategories();
            setCategories(updated);
            setForm({
                name: "",
                slug: "",
                description: ""
            });
            setEditingId(null);
        } catch (error: any) {
            alert("Failed to save category");
            console.error(error)
        }
    }

    const handleDelete = async (categoryId: string) => {
        try {
            await deleteCategory(categoryId);
            const updated = await getCategories();
            setCategories(updated);
        } catch (err) {
            alert("Failed to delete category");
            console.error(err);
        }
    };

    if (status === 'loading') return <p>Loading...</p>;
    if (!session?.user?.is_superuser) return <p>Unauthorized</p>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>

            <form onSubmit={handleSubmit} className="space-y-4 border p-4 mb-6 rounded">
                <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="input" required />
                <input name="slug" placeholder="Slug" value={form.slug} onChange={handleChange} className="input" required />
                <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="textarea" required />
                <button type="submit" className="btn">{editingId ? 'Update' : 'Add'} Category</button>
            </form>

            <ul>
                {categories.map((cat: any) => (
                    <li key={cat._id} className="border-b py-2 flex justify-between items-center">
                        <div>
                            <strong>{cat.name}</strong> <small className="text-gray-500">({cat.slug})</small>
                            <p>{cat.description}</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="btn-sm" onClick={() => {
                                setForm({
                                    name: cat.name,
                                    slug: cat.slug,
                                    description: cat.description,
                                });
                                setEditingId(cat._id);
                            }}>
                                Edit
                            </button>
                            <button className="btn-sm text-red-500" onClick={() => handleDelete(cat._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
            <button
                onClick={() => router.push("/admin")}
                className="bg-blue-600 text-white px-4 py-2 my-2 rounded"
            >
                Return to Dashboard
            </button>
        </div>
    )
}