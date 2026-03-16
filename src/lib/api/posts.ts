import { PostFormType } from "@/types/PostType";
import { PostWithCategory } from "@/types/PostViewType";
import { resolveApiUrl } from "./url";

type GetPostParams = {
    categoryId?: string;
    keywords?: string;
}

type GetPostsOptions = {
    baseUrl?: string;
}

type GetPostsResponse = {
    posts: PostWithCategory[];
}

type GetPostOptions = {
    baseUrl?: string;
}

export type PublicPost = PostWithCategory & {
    slug: string;
    image?: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export async function getPosts(
    params: GetPostParams = {},
    options: GetPostsOptions = {}
): Promise<GetPostsResponse> {
    const req = new URLSearchParams();

    if (params.categoryId) {
        req.set("categoryId", params.categoryId);
    }

    if (params.keywords) {
        req.set("keywords", params.keywords);
    }

    const queryString = req.toString();
    const path = queryString ? `/api/posts?${queryString}` : "/api/posts";
    const res = await fetch(resolveApiUrl(path, options.baseUrl));

    if (!res.ok) throw new Error("Failed to fetch posts");

    return res.json() as Promise<GetPostsResponse>;
}

export async function getPost(postId: string, options: GetPostOptions = {}): Promise<PostFormType>  {
    const res = await fetch(resolveApiUrl(`/api/posts/${postId}`, options.baseUrl));
    if (!res.ok) throw new Error("Failed to fetch post");
    const data = await res.json();
    return data.post;
}

export async function getPublicPostBySlug(
    slug: string,
    options: GetPostOptions = {}
): Promise<PublicPost> {
    const res = await fetch(resolveApiUrl(`/api/posts/${slug}`, options.baseUrl));

    if (!res.ok) {
        throw new Error("Failed to fetch post");
    }

    const data = await res.json();
    return data.post as PublicPost;
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
