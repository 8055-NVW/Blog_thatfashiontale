"use client"

import CategoryDropDown from "@/components/admin/CategoryDropdown";
import PostsList from "@/components/admin/PostsList";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
    const router = useRouter()
    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
            <section>
                <CategoryDropDown />
                <button
                    onClick={() => router.push("/admin/categories")}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Edit Categories
                </button>
            </section>
            <PostsList />
        </div>
    )
}