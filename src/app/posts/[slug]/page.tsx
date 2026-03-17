import { getPublicPostBySlug } from "@/lib/api/posts";
import { auth } from "@/auth";
import { applyDiscussionLikeState } from "@/components/post-interactions/discussionLikeState";
import PostSaveButton from "@/components/post-interactions/PostSaveButton";
import PostDiscussion from "@/components/post-interactions/PostDiscussion";
import { buildPostLikeCountLookup, buildPostLikeLookup } from "@/lib/likes/postLike";
import connect from "@/lib/mongoose";
import Like from "@/models/Like";
import Image from "next/image";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { DiscussionComment } from "@/components/post-interactions/types";
import { Types } from "mongoose";

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

async function getCommentReplies(commentId: string, baseUrl?: string) {
    const response = await fetch(`${baseUrl ?? ""}/api/comments/${commentId}/replies`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch replies");
    }

    const data = await response.json() as { replies?: DiscussionComment[] };
    return data.replies ?? [];
}

async function getDiscussionLikeState(commentIds: string[], userId?: string) {
    if (commentIds.length === 0) {
        return {
            countById: new Map<string, number>(),
            likedIds: new Set<string>(),
        };
    }

    await connect();

    const objectIds = commentIds.map((commentId) => new Types.ObjectId(commentId));
    const commentScope = {
        comment: { $in: objectIds },
        $or: [
            { post: null },
            { post: { $exists: false } },
        ],
    };

    const likeCounts = await Like.aggregate<{ _id: Types.ObjectId; count: number }>([
        {
            $match: commentScope,
        },
        {
            $group: {
                _id: "$comment",
                count: { $sum: 1 },
            },
        },
    ]);

    const countById = new Map<string, number>(
        likeCounts.map((entry) => [entry._id.toString(), entry.count])
    );

    const likedIds = new Set<string>();

    if (userId) {
        const likedComments = await Like.find({
            user: new Types.ObjectId(userId),
            ...commentScope,
        })
            .select("comment")
            .lean<{ comment?: Types.ObjectId }[]>();

        likedComments.forEach((entry) => {
            if (entry.comment) {
                likedIds.add(entry.comment.toString());
            }
        });
    }

    return { countById, likedIds };
}

async function getPostSaveState(postId: string, userId?: string) {
    await connect();

    const [likeCount, existingLike] = await Promise.all([
        Like.countDocuments(buildPostLikeCountLookup(postId)),
        userId ? Like.findOne(buildPostLikeLookup(userId, postId)).select("_id") : Promise.resolve(null),
    ]);

    return {
        likeCount,
        hasLiked: Boolean(existingLike),
    };
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
    let postSaveState = {
        likeCount: 0,
        hasLiked: false,
    };

    try {
        post = await getPublicPostBySlug(slug, { baseUrl });
        comments = await getPostComments(post._id, baseUrl);
        comments = await Promise.all(
            comments.map(async (comment) => ({
                ...comment,
                replies: await getCommentReplies(comment._id, baseUrl),
            }))
        );

        const commentIds = comments.flatMap((comment) => [
            comment._id,
            ...(comment.replies ?? []).map((reply) => reply._id),
        ]);
        const likeState = await getDiscussionLikeState(commentIds, session?.user?.id);

        comments = applyDiscussionLikeState(comments, likeState);
        postSaveState = await getPostSaveState(post._id, session?.user?.id);
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
                <PostSaveButton
                    postId={post._id}
                    hasLiked={postSaveState.hasLiked}
                    isSignedIn={Boolean(session?.user?.id)}
                    likeCount={postSaveState.likeCount}
                    signInHref={`/signin?callbackUrl=/posts/${slug}`}
                />
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
                postId={post._id}
                isSignedIn={Boolean(session?.user?.id)}
                signInHref={`/signin?callbackUrl=/posts/${slug}`}
            />
        </article>
    );
}
