import { CategoryWithId } from "@/types/CategoryType";
import { resolveApiUrl } from "./url";

type GetCategoriesOptions = {
    baseUrl?: string;
}

export async function getCategories(
    options: GetCategoriesOptions = {}
): Promise<CategoryWithId[]> {
    const res = await fetch(resolveApiUrl("/api/categories", options.baseUrl));

    if (!res.ok) {
        throw new Error("Failed to fetch categories")
    }

    return res.json() as Promise<CategoryWithId[]>;
}

export async function addOrUpdateCategory(
    form: { name: string; slug: string; description: string },
    editingId?: string,
    categories?: { _id: string; slug: string }[]
) {
    const method = editingId ? "PATCH" : "POST";

    const payload = editingId
        ? {
            identifier: categories?.find((category) => category._id === editingId)?.slug,
            newName: form.name,
            newSlug: form.slug,
            newDescription: form.description,
        }
        : form;

    const res = await fetch("/api/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to save category");
    return res.json();
}

export async function deleteCategory(categoryId: string) {
    const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId }),
    });
    if (!res.ok) throw new Error("Failed to delete category");
}
