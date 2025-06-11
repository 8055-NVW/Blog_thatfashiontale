import CategoryDropDown from "@/components/admin/CategoryDropdown";
import PostsList from "@/components/admin/PostsList";

export default function AdminDashboardPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
            <CategoryDropDown/>
            <PostsList/>
        </div>
    )
}