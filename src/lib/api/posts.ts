import { PostFormType } from "@/types/PostType";

type GetPostParams = {
    categoryId?: string;
    keywords?: string;
}

export async function getPosts(params: GetPostParams = {}) {
    const req = new URLSearchParams();

    if (params.categoryId) {
        req.set("categoryId", params.categoryId);
    }

    if (params.keywords) {
        req.set("keywords", params.keywords);
    }
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/posts?${req.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
}

export async function getPost(postId: string): Promise<PostFormType>  {
    const res = await fetch(`/api/posts/${postId}`);
    if (!res.ok) throw new Error("Failed to fetch post");
    const data = await res.json();
    return data.post;
}

export async function updatePost(postId: string, form: PostFormType, userId: string) {
    const queryParams = new URLSearchParams({ userId });
    const res = await fetch(`/api/posts/${postId}?${queryParams.toString()}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
    });
    if (!res.ok) throw new Error("Failed to update post");
    return res.json();
}

export async function deletePost(postId: string): Promise<Response> {
    return await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
}