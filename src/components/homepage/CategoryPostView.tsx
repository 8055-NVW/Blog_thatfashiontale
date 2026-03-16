"use client";

import { useState } from "react";
import CategoryFilter from "./CategoryFilter";
import PostGrid from "./PostGrid";
import { CategoryWithId } from "@/types/CategoryType";
import { PostWithCategory } from "@/types/PostViewType";


interface Props {
  posts: PostWithCategory[];
  categories: CategoryWithId[];
}

export default function CategoryPostView({ posts, categories }: Props) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const selectedCategory = selectedCategoryId
    ? categories.find((category) => category._id === selectedCategoryId) ?? null
    : null;

  const filteredPosts = selectedCategoryId
    ? posts.filter((post) => post.category?._id === selectedCategoryId)
    : posts;

  return (
    <section id="browse-posts" className="space-y-6">
      <CategoryFilter
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategorySelect={setSelectedCategoryId}
      />

      {selectedCategory && (
        <div className="px-4">
          <div className="rounded-2xl border border-black/5 bg-white/80 px-5 py-4 text-sm text-gray-700 shadow-sm">
            <span className="font-semibold text-gray-900">Now browsing:</span>{" "}
            {selectedCategory.name}.
            {" "}
            <span>
              {filteredPosts.length === 0
                ? "There are no published stories in this category yet."
                : `${filteredPosts.length} stor${filteredPosts.length === 1 ? "y" : "ies"} ready to read.`}
            </span>
          </div>
        </div>
      )}

      <PostGrid posts={filteredPosts} selectedCategoryName={selectedCategory?.name ?? null} />
    </section>
  );
}
