import { CategoryWithId } from "@/types/CategoryType";
import { extractApiMessage } from "@/features/admin/lib/adminFeedback";
import { resolveApiUrl } from "./url";

type GetCategoriesOptions = {
    baseUrl?: string;
}

async function getMutationError(response: Response, fallbackMessage: string) {
    const payload = await response.json().catch(() => null);
    return extractApiMessage(payload, fallbackMessage);
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
) {
    const method = editingId ? "PATCH" : "POST";

    const payload = editingId
        ? {
            categoryId: editingId,
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

    if (!res.ok) {
        throw new Error(await getMutationError(res, "Failed to save category"));
    }

    return res.json();
}

export async function deleteCategory(categoryId: string) {
    const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId }),
    });

    if (!res.ok) {
        throw new Error(await getMutationError(res, "Failed to delete category"));
    }
}
