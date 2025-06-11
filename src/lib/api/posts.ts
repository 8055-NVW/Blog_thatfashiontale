export async function deletePost(postId: string): Promise<Response> {
    return await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
}