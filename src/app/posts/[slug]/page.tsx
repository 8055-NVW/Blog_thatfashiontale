import { getPublicPostBySlug } from "@/lib/api/posts";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

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

export default async function PostDetailPage({ params }: PostDetailPageProps) {
    const { slug } = await params;
    const requestHeaders = await headers();
    const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    const protocol = requestHeaders.get("x-forwarded-proto")
        ?? (host?.includes("localhost") || host?.startsWith("127.0.0.1") ? "http" : "https");
    const baseUrl = host ? `${protocol}://${host}` : undefined;

    let post;

    try {
        post = await getPublicPostBySlug(slug, { baseUrl });
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
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full rounded-2xl object-cover shadow-sm"
                />
            )}

            <section className="space-y-5 text-base leading-8 text-gray-800">
                {contentParagraphs.map((paragraph, index) => (
                    <p key={`${slug}-${index}`}>{paragraph}</p>
                ))}
            </section>
        </article>
    );
}
