"use client"

import AdminNotice from "./AdminNotice";
import { CategoryWithId } from "@/types/CategoryType";
import { getCategories } from "@/lib/api/categories"
import { useEffect, useState } from "react"

interface Props {
  selectedCategoryId: string;
  onSelect: (id: string) => void;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export default function CategoryDropDown({ selectedCategoryId, onSelect }: Props) {

    const [categories, setCategories] = useState<CategoryWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
                setError(null);
            } catch (err) {
                setError(getErrorMessage(err));
                console.error("Failed to fetch categories:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [])

    if (loading) {
        return <AdminNotice message="Loading categories..." />;
    }

    if (error) {
        return <AdminNotice tone="error" message={error} />;
    }

    return (
        <div className="space-y-2 lg:max-w-sm">
          <label htmlFor="admin-category-filter" className="text-sm font-medium text-fg-muted">
            Filter posts by category
          </label>
          <select
            id="admin-category-filter"
            value={selectedCategoryId}
            onChange={(e) => onSelect(e.target.value)}
            className="select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
    )
}
