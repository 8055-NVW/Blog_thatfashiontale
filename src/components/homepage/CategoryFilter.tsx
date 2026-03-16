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
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="px-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Browse by Category</h2>
          <p className="mt-1 text-sm text-gray-600">Pick a topic to narrow the reading list, or keep everything in view.</p>
        </div>
        {selectedCategoryId !== null && (
          <button
            onClick={() => onCategorySelect(null)}
            className="shrink-0 text-sm font-medium text-gray-700 underline underline-offset-4 transition hover:text-gray-950"
          >
            Clear filter
          </button>
        )}
      </div>
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
