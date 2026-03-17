import connect from "@/lib/mongoose";
import { requireSessionUserId } from "@/lib/auth/requireSessionUserId";
import { buildCommentLikeDocument, buildCommentLikeLookup } from "@/lib/likes/commentLike";
import Like from "@/models/Like";
import Comment from "@/models/Comment";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Unknown error";
}

function isDuplicateKeyError(error: unknown) {
    return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

type CommentRouteContext = {
    params: Promise<{
        comment: string;
    }>;
};

async function getCommentIdFromContext(context: CommentRouteContext) {
    const { comment } = await context.params;
    return comment;
}

// GET: Check like status
export const GET = async (request: Request, context: CommentRouteContext) => {
    try {
        const commentId = await getCommentIdFromContext(context);
        const userId = await requireSessionUserId();

        if (!commentId || !Types.ObjectId.isValid(commentId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid commentId" }),
                { status: 400 }
            );
        }

        await connect()

        const post = await Comment.findById(commentId);
        if (!post) {
            return new NextResponse(
                JSON.stringify({ message: "Comment not found" }),
                { status: 404 }
            );
        }

        if (!userId) {
            return new NextResponse(
                JSON.stringify({ hasLiked: false }),
                { status: 200 }
            );
        }

        const like = await Like.findOne(buildCommentLikeLookup(userId, commentId));

        return new NextResponse(
            JSON.stringify({ hasLiked: !!like }),
            { status: 200 }
        );

    } catch (error: unknown) {
        return new NextResponse(
            JSON.stringify({ message: "Error checking like status", error: getErrorMessage(error) }),
            { status: 500 }
        );
    }
};


// POST: Like 
export const POST = async (request: Request, context: CommentRouteContext) => {
    try {
        const commentId = await getCommentIdFromContext(context);
        const userId = await requireSessionUserId();

        if (!userId) {
            return new NextResponse(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            );
        }

        if (!commentId || !Types.ObjectId.isValid(commentId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid commentId" }),
                { status: 400 }
            );
        }

        await connect();

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return new NextResponse(
                JSON.stringify({ message: "Comment not found" }),
                { status: 404 }
            );
        }

        const existingLike = await Like.findOne(buildCommentLikeLookup(userId, commentId));

        if (existingLike) {
            return new NextResponse(
                JSON.stringify({ message: "Comment already liked" }),
                { status: 409 }
            );
        }

        const newLike = new Like(buildCommentLikeDocument(userId, commentId));

        await newLike.save();

        return new NextResponse(
            JSON.stringify({ message: "Comment liked successfully" }),
            { status: 201 }
        );
    } catch (error: unknown) {
        if (isDuplicateKeyError(error)) {
            return new NextResponse(
                JSON.stringify({ message: "Comment already liked" }),
                { status: 409 }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: "Failed to like comment", error: getErrorMessage(error) }),
            { status: 500 }
        );
    }
};

// DELETE: Unlike
export const DELETE = async (request: Request, context: CommentRouteContext) => {
    try {
        const commentId = await getCommentIdFromContext(context);
        const userId = await requireSessionUserId();

        if (!userId) {
            return new NextResponse(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            );
        }

        if (!commentId || !Types.ObjectId.isValid(commentId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid commentId" }),
                { status: 400 }
            );
        }

        await connect();

        const result = await Like.findOneAndDelete(buildCommentLikeLookup(userId, commentId));

        if (!result) {
            return new NextResponse(
                JSON.stringify({ message: "Like not found" }),
                { status: 404 }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: "Comment unliked successfully" }),
            { status: 200 }
        );
    } catch (error: unknown) {
        return new NextResponse(
            JSON.stringify({ message: "Failed to unlike comment", error: getErrorMessage(error) }),
            { status: 500 }
        );
    }
};
