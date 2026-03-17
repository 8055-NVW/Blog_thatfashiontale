import { getPublicPostBySlug } from "@/lib/api/posts";
import { auth } from "@/auth";
import PostDiscussion from "@/components/post-interactions/PostDiscussion";
import Image from "next/image";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { DiscussionComment } from "@/components/post-interactions/types";

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

async function getPostComments(postId: string, baseUrl?: string): Promise<DiscussionComment[]> {
    const response = await fetch(`${baseUrl ?? ""}/api/posts/${postId}/comments`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch comments");
    }

    const data = await response.json() as { comments?: DiscussionComment[] };
    return data.comments ?? [];
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
    const { slug } = await params;
    const requestHeaders = await headers();
    const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    const protocol = requestHeaders.get("x-forwarded-proto")
        ?? (host?.includes("localhost") || host?.startsWith("127.0.0.1") ? "http" : "https");
    const baseUrl = host ? `${protocol}://${host}` : undefined;
    const session = await auth();

    let post;
    let comments: DiscussionComment[] = [];

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

            <PostDiscussion
                comments={comments}
                formatDate={formatDate}
                postId={post._id}
                isSignedIn={Boolean(session?.user?.id)}
                signInHref={`/signin?callbackUrl=/posts/${slug}`}
            />
        </article>
    );
}
