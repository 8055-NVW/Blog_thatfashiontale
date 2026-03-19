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
    <section className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-fg-subtle">Browse</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-fg md:text-3xl">Explore the archive by category</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-fg-muted md:text-base">
            Narrow the reading list when you want something specific, or keep every story in view.
          </p>
        </div>
        {selectedCategoryId !== null && (
          <button
            onClick={() => onCategorySelect(null)}
            className="shrink-0 text-sm font-medium text-fg-muted underline decoration-border-strong underline-offset-4 transition hover:text-fg"
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        <button
          onClick={() => onCategorySelect(null)}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
            selectedCategoryId === null
              ? "border-accent bg-accent text-fg-inverse"
              : "border-border bg-surface text-fg-muted hover:border-border-strong hover:bg-accent-soft hover:text-fg"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onCategorySelect(category._id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
              selectedCategoryId === category._id
                ? "border-accent bg-accent text-fg-inverse"
                : "border-border bg-surface text-fg-muted hover:border-border-strong hover:bg-accent-soft hover:text-fg"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </section>
  );
}
