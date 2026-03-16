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
        <div className="max-w-5xl mx-auto space-y-6 py-8">
            <h2 className="text-2xl font-bold">{submitLabel} Post</h2>
            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    {form.image && (
                        <img
                            src={form.image}
                            alt="PostPreview"
                            className="w-full rounded shadow"
                        />
                    )}
                    <button
                        type="button"
                        className="border border-dashed border-gray-400 px-4 py-2 rounded text-sm"
                        onClick={() => setShowHotspotModal(true)}
                    >
                        {hasHotspots ? "Edit Hotspots" : "+ Add Hotspot"}
                    </button>
                </div>
                <div className="flex-1 space-y-4">
                    <input
                        name="title"
                        placeholder="Title"
                        value={form.title}
                        onChange={handleChange}
                        className="input w-full"
                        required
                    />
                    <input
                        name="slug"
                        placeholder="Slug"
                        value={form.slug}
                        onChange={handleChange}
                        className="input w-full"
                        required
                    />
                    <textarea
                        name="content"
                        placeholder="Content"
                        value={form.content}
                        onChange={handleChange}
                        className="textarea w-full"
                        rows={6}
                        required
                    />
                    <input
                        name="image"
                        placeholder="Image URL"
                        value={form.image}
                        onChange={handleChange}
                        className="input w-full"
                        required
                    />
                    <select
                        value={selectedCategoryId}
                        onChange={(e) => {
                            setSelectedCategoryId(e.target.value);
                            setForm((prev) => ({ ...prev, category: e.target.value }));
                        }}
                        className="border p-2 rounded w-full"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 my-2 rounded"
                    >
                        Save
                    </button>
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
            <button
                onClick={() => router.push("/admin")}
                className="bg-blue-600 text-white px-4 py-2 my-2 rounded"
            >
                Return to Dashboard
            </button>
        </div>
    )
}
