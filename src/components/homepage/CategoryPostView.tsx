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

  const filteredPosts = selectedCategoryId
    ? posts.filter((post) => post.category?._id === selectedCategoryId)
    : posts;

  return (
    <>
      <CategoryFilter
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategorySelect={setSelectedCategoryId}
      />
      <PostGrid posts={filteredPosts} />
    </>
  );
}