"use client"

import CategoryDropDown from "@/components/admin/CategoryDropdown";
import PostsList from "@/components/admin/PostsList";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function AdminDashboardPage() {
    const router = useRouter();
    const [selectedCategoryId, setSelectedCategoryId] = useState("");

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
            <section className="flex ">
                <CategoryDropDown
                    selectedCategoryId={selectedCategoryId}
                    onSelect={(id) => setSelectedCategoryId(id)} />
                <button
                    onClick={() => router.push("/admin/categories")}
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                    Edit Categories
                </button>
            </section>
            <PostsList categoryId={selectedCategoryId}/>
        </div>
    )
}