"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { addOrUpdateCategory, deleteCategory, getCategories } from "@/lib/api/categories";
import { CategoryWithId } from "@/types/CategoryType";

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Unknown error";
}

export default function CategoryDashboard() {
    const router = useRouter();
    const [categories, setCategories] = useState<CategoryWithId[]>([]);
    const [form, setForm] = useState({ name: "", slug: "", description: "" });
    const [editingId, setEditingId] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error: unknown) {
            console.error("Failed to fetch categories:", getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addOrUpdateCategory(form, editingId, categories);
            await fetchCategories();
            setForm({ name: "", slug: "", description: "" });
            setEditingId(undefined);
        } catch (error: unknown) {
            alert("Failed to save category");
            console.error(error)
        }
    }

    const handleDelete = async (categoryId: string) => {
        try {
            await deleteCategory(categoryId);
            await fetchCategories();
        } catch (err) {
            alert("Failed to delete category");
            console.error(err);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>

            <form onSubmit={handleSubmit} className="space-y-4 border p-4 mb-6 rounded">
                <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="input" required />
                <input name="slug" placeholder="Slug" value={form.slug} onChange={handleChange} className="input" required />
                <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="textarea" required />
                <button type="submit" className="btn">{editingId ? 'Update' : 'Add'} Category</button>
            </form>
            {loading ?
                <p>Loading...</p>
                :
                <ul>
                    {categories.map((cat) => (
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
            }
            <button
                onClick={() => router.push("/admin")}
                className="bg-blue-600 text-white px-4 py-2 my-2 rounded"
            >
                Return to Dashboard
            </button>
        </div>
    )
}
