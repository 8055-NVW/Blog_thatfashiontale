import { redirect } from "next/navigation";

export default function LegacyDashboardCreatePostPage() {
    redirect("/admin/posts/create");
}
