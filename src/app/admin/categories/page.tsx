"use client"

import AdminNotice from "@/components/admin/AdminNotice";
import PublicConfirmDialog from "@/components/post-interactions/PublicConfirmDialog";
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
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const [pendingDeleteCategory, setPendingDeleteCategory] = useState<CategoryWithId | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await getCategories();
            setCategories(data);
            setError(null);
        } catch (error: unknown) {
            console.error("Failed to fetch categories:", getErrorMessage(error));
            setError("Could not load categories. Please try again.");
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
            setNotice(editingId ? "Category updated." : "Category added.");
            setError(null);
        } catch (error: unknown) {
            console.error(error)
            setError(getErrorMessage(error));
        }
    }

    const handleDelete = async () => {
        if (!pendingDeleteCategory || isDeleting) return;

        setIsDeleting(true);
        try {
            await deleteCategory(pendingDeleteCategory._id);
            await fetchCategories();
            setNotice(`Deleted “${pendingDeleteCategory.name}”.`);
            setPendingDeleteCategory(null);
        } catch (err) {
            console.error(err);
            setError(getErrorMessage(err));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl space-y-5 p-4">
            <div className="space-y-1">
                <p className="meta-label">Admin editor</p>
                <h1 className="text-2xl font-semibold tracking-[-0.02em] text-fg">Manage Categories</h1>
            </div>

            {error ? <AdminNotice tone="error" message={error} /> : null}
            {!error && notice ? <AdminNotice tone="success" message={notice} /> : null}

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
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <button type="submit" className="btn w-full sm:w-auto">{editingId ? 'Update' : 'Add'} Category</button>
                    {editingId ? (
                        <button
                            type="button"
                            className="btn-secondary w-full sm:w-auto"
                            onClick={() => {
                                setForm({ name: "", slug: "", description: "" });
                                setEditingId(undefined);
                                setError(null);
                            }}
                        >
                            Cancel edit
                        </button>
                    ) : null}
                </div>
            </form>
            {loading ?
                <AdminNotice message="Loading categories..." />
                :
                <ul className="space-y-3">
                    {categories.map((cat) => (
                        <li key={cat._id} className="admin-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <strong className="text-fg">{cat.name}</strong> <small className="text-fg-subtle">({cat.slug})</small>
                                <p className="mt-1 text-sm leading-6 text-fg-muted">{cat.description}</p>
                            </div>
                            <div className="grid w-full gap-2 sm:w-auto sm:flex sm:flex-wrap">
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
                                <button type="button" className="btn-danger btn-sm w-full sm:w-auto" onClick={() => {
                                    setError(null);
                                    setNotice(null);
                                    setPendingDeleteCategory(cat);
                                }}>Delete</button>
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
            {pendingDeleteCategory ? (
                <PublicConfirmDialog
                    title="Delete this category?"
                    description={`This will remove “${pendingDeleteCategory.name}”. Make sure no posts still depend on it before confirming.`}
                    confirmLabel="Delete category"
                    isSubmitting={isDeleting}
                    onConfirm={handleDelete}
                    onClose={() => {
                        if (!isDeleting) {
                            setPendingDeleteCategory(null);
                        }
                    }}
                />
            ) : null}
        </div>
    )
}
