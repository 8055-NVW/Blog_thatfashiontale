import { CategoryWithId } from "@/types/CategoryType";

interface CategoryFilterProps {
  categories: CategoryWithId[];
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategoryId,
  onCategorySelect
}: CategoryFilterProps) {
  return (
    <section className="px-4">
      <h2 className="text-2xl font-semibold mb-4">Categories</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        <button
          onClick={() => onCategorySelect(null)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition border ${
            selectedCategoryId === null
              ? "bg-black text-white"
              : "bg-white text-black border-gray-300 hover:bg-gray-100"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onCategorySelect(category._id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition border ${
              selectedCategoryId === category._id
                ? "bg-black text-white"
                : "bg-white text-black border-gray-300 hover:bg-gray-100"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </section>
  );
}

