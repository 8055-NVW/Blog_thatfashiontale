import { CategoryWithId } from "@/types/CategoryType";
import { PostFormType } from "@/types/PostType"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HotspotModal from "./HotspotModal";

type PostFormProps = {
    initialForm: PostFormType;
    categories: CategoryWithId[];
    submitLabel?: string;
    onSubmit: (form: PostFormType, categoryId: string) => Promise<void>;
}

export default function PostForm({
    initialForm,
    categories,
    submitLabel,
    onSubmit,
}: PostFormProps) {
    const [form, setForm] = useState<PostFormType>({
        title: "",
        slug: "",
        content: "",
        image: "",
        category: "",
        user: "",
        hotspots: [],
    });
    const router = useRouter();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [showHotspotModal, setShowHotspotModal] = useState(false);
    const hasHotspots = form.hotspots && form.hotspots.length > 0
    const hasImage = Boolean(form.image.trim());

    useEffect(() => {
        setForm(initialForm)
        setSelectedCategoryId(
            typeof initialForm.category === "string"
                ? initialForm.category
                : initialForm.category._id
        );
    }, [initialForm]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategoryId) {
            alert("Missing category");
            return;
        }
        await onSubmit(form, selectedCategoryId);
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6 py-8">
            <div className="space-y-2">
                <p className="meta-label">Admin editor</p>
                <h2 className="text-2xl font-semibold tracking-[-0.02em] text-fg">{submitLabel} Post</h2>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                <div className="space-y-4">
                    {form.image && (
                        // eslint-disable-next-line @next/next/no-img-element -- Admin preview accepts arbitrary remote image URLs during editing.
                        <img
                            src={form.image}
                            alt="PostPreview"
                            className="admin-card w-full object-cover"
                        />
                    )}
                    <div className="admin-card space-y-3 p-4 md:p-5">
                        <div className="space-y-1">
                            <p className="meta-label">Lead image</p>
                            <p className="text-sm leading-6 text-fg-muted">
                                Add an image first, then place and edit hotspots for public product notes.
                            </p>
                        </div>
                        {hasImage ? (
                            <p className="text-sm text-fg-muted">
                                {hasHotspots ? `${form.hotspots.length} marker${form.hotspots.length === 1 ? "" : "s"} currently in this draft.` : "No hotspots added yet."}
                            </p>
                        ) : (
                            <p className="rounded-lg border border-dashed border-border-strong bg-subtle px-3 py-2 text-sm text-fg-muted">
                                Enter a lead image URL to enable hotspot placement.
                            </p>
                        )}
                        <button
                            type="button"
                            className="btn-secondary w-full sm:w-auto"
                            disabled={!hasImage}
                            onClick={() => setShowHotspotModal(true)}
                        >
                            {hasHotspots ? "Edit Hotspots" : "+ Add Hotspot"}
                        </button>
                    </div>
                </div>
                <div className="admin-card space-y-4 p-4 md:p-5">
                    <div className="space-y-1">
                        <p className="meta-label">Post details</p>
                        <p className="text-sm leading-6 text-fg-muted">Fill in the core editorial fields before saving.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="admin-post-title" className="text-sm font-medium text-fg-muted">Title</label>
                            <input id="admin-post-title" name="title" placeholder="Title" value={form.title} onChange={handleChange} className="input" required />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="admin-post-slug" className="text-sm font-medium text-fg-muted">Slug</label>
                            <input id="admin-post-slug" name="slug" placeholder="Slug" value={form.slug} onChange={handleChange} className="input" required />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="admin-post-content" className="text-sm font-medium text-fg-muted">Content</label>
                            <textarea id="admin-post-content" name="content" placeholder="Content" value={form.content} onChange={handleChange} className="textarea" rows={8} required />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="admin-post-image" className="text-sm font-medium text-fg-muted">Image URL</label>
                            <input id="admin-post-image" name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="input" required />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="admin-post-category" className="text-sm font-medium text-fg-muted">Category</label>
                            <select
                                id="admin-post-category"
                                value={selectedCategoryId}
                                onChange={(e) => {
                                    setSelectedCategoryId(e.target.value);
                                    setForm((prev) => ({ ...prev, category: e.target.value }));
                                }}
                                className="select"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-between">
                        <button type="button" onClick={() => router.push("/admin")} className="btn-secondary">
                            Return to Dashboard
                        </button>
                        <button type="submit" className="btn-primary">
                            Save
                        </button>
                    </div>
                </div>
            </form>
            {showHotspotModal && form.image && (
                <HotspotModal
                    imageUrl={form.image}
                    initialHotspots={form.hotspots}
                    onSave={(updatedHotspots) => {
                        setForm({ ...form, hotspots: updatedHotspots });
                        setShowHotspotModal(false);
                    }}
                    onClose={() => setShowHotspotModal(false)}
                />
            )}
        </div>
    )
}
