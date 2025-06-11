"use client"

import { CategoryWithId } from "@/types/CategoryType";
import { getCategories } from "@/lib/api/categories"
import { useEffect, useState } from "react"

interface Props {
  selectedCategoryId: string;
  onSelect: (id: string) => void;
}

export default function CategoryDropDown({ selectedCategoryId, onSelect }: Props) {

    const [categories, setCategories] = useState<CategoryWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err: any) {
                setError(err.message);
                console.error("Failed to fetch categories:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [])

    if (loading) {
        return <p>Loading categories...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="flex items-center gap-4 mb-6">
      <select
        value={selectedCategoryId}
        onChange={(e) => onSelect(e.target.value)}
        className="border p-2 rounded"
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