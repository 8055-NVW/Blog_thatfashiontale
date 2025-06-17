type GetPostParams = {
    categoryId?: string;
    keywords?: string;
}

export async function getPosts(params: GetPostParams = {}) {
    const req = new URLSearchParams();

    if (params.categoryId) {
        req.set("categoryId", params.categoryId);
    }

    if(params.keywords) {
        req.set("keywords", params.keywords);
    }

    const res = await fetch(`/api/posts?${req.toString()}`);
    if(!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
}

export async function deletePost(postId: string): Promise<Response> {
    return await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
}