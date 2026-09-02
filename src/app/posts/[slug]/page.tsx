import { env } from "@/config/env";
import { getPublicPostBySlug } from "@/lib/api/posts";
import { auth } from "@/auth";
import { applyDiscussionLikeState } from "@/components/post-interactions/discussionLikeState";
import { applyDiscussionOwnershipState } from "@/components/post-interactions/discussionOwnershipState";
import PostSaveButton from "@/components/post-interactions/PostSaveButton";
import PostDiscussion from "@/components/post-interactions/PostDiscussion";
import { buildPostLikeCountLookup, buildPostLikeLookup } from "@/lib/likes/postLike";
import connect from "@/lib/mongoose";
import Like from "@/models/Like";
import { notFound } from "next/navigation";
import { DiscussionComment } from "@/components/post-interactions/types";
import { Types } from "mongoose";
import PostHotspots from "@/components/posts/PostHotspots";

export const dynamic = "force-dynamic";

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
    const baseUrl = new URL(env.AUTH_URL).origin;
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
        comments = applyDiscussionOwnershipState(comments, session?.user?.id);

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
        <article className="content-container space-y-10 py-10 md:space-y-12 md:py-14">
            <header className="space-y-6">
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.24em] text-fg-subtle">
                        <span>{post.category?.name ?? "Post"}</span>
                        {publishedDate ? <span>{publishedDate}</span> : null}
                    </div>

                    <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-fg md:text-5xl lg:text-[3.6rem]">
                        {post.title}
                    </h1>

                    {(post.user?.name || publishedDate) && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fg-muted md:text-base">
                            {post.user?.name ? <span>By {post.user.name}</span> : null}
                            {post.user?.name && publishedDate ? <span aria-hidden="true" className="text-fg-subtle">/</span> : null}
                            <span>Editorial reading</span>
                        </div>
                    )}
                </div>

                <PostSaveButton
                    postId={post._id}
                    hasLiked={postSaveState.hasLiked}
                    isSignedIn={Boolean(session?.user?.id)}
                    likeCount={postSaveState.likeCount}
                    signInHref={`/signin?callbackUrl=/posts/${slug}`}
                />
            </header>

            {post.image && (
                <PostHotspots
                    image={post.image}
                    title={post.title}
                    hotspots={post.hotspots}
                />
            )}

            <section className="space-y-6 text-lg leading-9 text-fg md:space-y-7 md:text-[1.15rem] md:leading-10">
                {contentParagraphs.map((paragraph, index) => (
                    <p key={`${slug}-${index}`} className="max-w-[68ch] text-fg">
                        {paragraph}
                    </p>
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
