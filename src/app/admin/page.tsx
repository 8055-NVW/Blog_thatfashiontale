"use client"

import CategoryDropDown from "@/components/admin/CategoryDropdown";
import PostsList from "@/components/admin/PostsList";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function AdminDashboardPage() {
    const router = useRouter();
    const [selectedCategoryId, setSelectedCategoryId] = useState("");

    return (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-2 md:px-2 md:py-3">
            <section className="admin-card space-y-4 p-4 md:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-1">
                        <p className="meta-label">Dashboard</p>
                        <h2 className="text-xl font-semibold tracking-[-0.02em] text-fg md:text-2xl">Posts and taxonomy</h2>
                        <p className="text-sm leading-6 text-fg-muted">
                            Filter the archive, jump into category management, or start a new post draft.
                        </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap">
                        <button
                            type="button"
                            onClick={() => router.push("/admin/categories")}
                            className="btn-secondary w-full lg:w-auto"
                        >
                            Manage Categories
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/admin/posts/create")}
                            className="btn-primary w-full lg:w-auto"
                        >
                            New Post
                        </button>
                    </div>
                </div>

                <CategoryDropDown
                    selectedCategoryId={selectedCategoryId}
                    onSelect={(id) => setSelectedCategoryId(id)} />
            </section>

            <PostsList categoryId={selectedCategoryId}/>
        </div>
    )
}
