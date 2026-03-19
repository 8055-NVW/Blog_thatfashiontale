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
        <div className="mx-auto max-w-2xl space-y-5 p-4">
            <div className="space-y-1">
                <p className="meta-label">Admin editor</p>
                <h1 className="text-2xl font-semibold tracking-[-0.02em] text-fg">Manage Categories</h1>
            </div>

            <form onSubmit={handleSubmit} className="admin-card space-y-4 p-4 md:p-5">
                <div className="space-y-2">
                    <label htmlFor="admin-category-name" className="text-sm font-medium text-fg-muted">Name</label>
                    <input id="admin-category-name" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="input" required />
                </div>
                <div className="space-y-2">
                    <label htmlFor="admin-category-slug" className="text-sm font-medium text-fg-muted">Slug</label>
                    <input id="admin-category-slug" name="slug" placeholder="Slug" value={form.slug} onChange={handleChange} className="input" required />
                </div>
                <div className="space-y-2">
                    <label htmlFor="admin-category-description" className="text-sm font-medium text-fg-muted">Description</label>
                    <textarea id="admin-category-description" name="description" placeholder="Description" value={form.description} onChange={handleChange} className="textarea" required />
                </div>
                <button type="submit" className="btn">{editingId ? 'Update' : 'Add'} Category</button>
            </form>
            {loading ?
                <p>Loading...</p>
                :
                <ul className="space-y-3">
                    {categories.map((cat) => (
                        <li key={cat._id} className="admin-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <strong className="text-fg">{cat.name}</strong> <small className="text-fg-subtle">({cat.slug})</small>
                                <p className="mt-1 text-sm leading-6 text-fg-muted">{cat.description}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button type="button" className="btn-sm" onClick={() => {
                                    setForm({
                                        name: cat.name,
                                        slug: cat.slug,
                                        description: cat.description,
                                    });
                                    setEditingId(cat._id);
                                }}>
                                    Edit
                                </button>
                                <button type="button" className="btn-danger btn-sm" onClick={() => handleDelete(cat._id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            }
            <button
                type="button"
                onClick={() => router.push("/admin")}
                className="btn-secondary"
            >
                Return to Dashboard
            </button>
        </div>
    )
}
