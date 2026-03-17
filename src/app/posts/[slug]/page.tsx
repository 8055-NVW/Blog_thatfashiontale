import { getPublicPostBySlug } from "@/lib/api/posts";
import Image from "next/image";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type PostComment = {
    _id: string;
    content: string;
    createdAt?: Date | string;
    user?: {
        _id?: string;
        name?: string;
        image?: string;
    };
};

type PostDetailPageProps = {
    params: Promise<{
        slug: string;
    }>;
}

function formatDate(date?: Date | string) {
    if (!date) {
        return null;
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(parsedDate);
}

async function getPostComments(postId: string, baseUrl?: string): Promise<PostComment[]> {
    const response = await fetch(`${baseUrl ?? ""}/api/posts/${postId}/comments`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch comments");
    }

    const data = await response.json() as { comments?: PostComment[] };
    return data.comments ?? [];
}

function getInitial(name?: string) {
    return (name ?? "U").trim().charAt(0).toUpperCase();
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
    const { slug } = await params;
    const requestHeaders = await headers();
    const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    const protocol = requestHeaders.get("x-forwarded-proto")
        ?? (host?.includes("localhost") || host?.startsWith("127.0.0.1") ? "http" : "https");
    const baseUrl = host ? `${protocol}://${host}` : undefined;

    let post;
    let comments: PostComment[] = [];

    try {
        post = await getPublicPostBySlug(slug, { baseUrl });
        comments = await getPostComments(post._id, baseUrl);
    } catch {
        notFound();
    }

    const publishedDate = formatDate(post.createdAt);
    const contentParagraphs = post.content
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

    return (
        <article className="max-w-3xl mx-auto px-4 py-10 space-y-8">
            <header className="space-y-4">
                <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
                    {post.category?.name ?? "Post"}
                </p>
                <h1 className="text-4xl font-bold leading-tight text-gray-900">{post.title}</h1>
                {(post.user?.name || publishedDate) && (
                    <p className="text-sm text-gray-600">
                        {post.user?.name ? `By ${post.user.name}` : null}
                        {post.user?.name && publishedDate ? " - " : null}
                        {publishedDate}
                    </p>
                )}
            </header>

            {post.image && (
                <Image
                    src={post.image}
                    alt={post.title}
                    width={1200}
                    height={675}
                    className="w-full rounded-2xl object-cover shadow-sm"
                />
            )}

            <section className="space-y-5 text-base leading-8 text-gray-800">
                {contentParagraphs.map((paragraph, index) => (
                    <p key={`${slug}-${index}`}>{paragraph}</p>
                ))}
            </section>

            <section className="space-y-6 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Comments</p>
                        <h2 className="mt-1 text-2xl font-semibold text-gray-900">Reader conversation</h2>
                    </div>
                    <p className="text-sm text-gray-500">{comments.length} total</p>
                </div>

                {comments.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center text-sm text-gray-600">
                        No comments yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {comments.map((comment) => {
                            const commentDate = formatDate(comment.createdAt);

                            return (
                                <article
                                    key={comment._id}
                                    className="rounded-2xl border border-black/10 bg-[#fcfaf8] p-5"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efe4da] text-sm font-semibold text-gray-700">
                                            {getInitial(comment.user?.name)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{comment.user?.name ?? "Reader"}</p>
                                            {commentDate ? (
                                                <p className="text-sm text-gray-500">{commentDate}</p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <p className="mt-4 text-base leading-7 text-gray-800">{comment.content}</p>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </article>
    );
}
