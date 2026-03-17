import connect from "@/lib/mongoose";
import Like from "@/models/Like";
import Comment from "@/models/Comment";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

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
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                { status: 400 }
            );
        }

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

        const like = await Like.findOne({
            user: userId,
            comment: commentId
        });

        return new NextResponse(
            JSON.stringify({ hasLiked: !!like }),
            { status: 200 }
        );

    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: "Error checking like status", error: error.message }),
            { status: 500 }
        );
    }
};


// POST: Like 
export const POST = async (request: Request, context: CommentRouteContext) => {
    try {
        const commentId = await getCommentIdFromContext(context);
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                { status: 400 }
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

        const existingLike = await Like.findOne({
            user: userId,
            comment: commentId
        });

        if (existingLike) {
            return new NextResponse(
                JSON.stringify({ message: "Comment already liked" }),
                { status: 409 }
            );
        }

        const newLike = new Like({
            user: userId,
            comment: commentId
        });

        await newLike.save();

        return new NextResponse(
            JSON.stringify({ message: "Comment liked successfully" }),
            { status: 201 }
        );
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: "Failed to like comment", error: error.message }),
            { status: 500 }
        );
    }
};

// DELETE: Unlike
export const DELETE = async (request: Request, context: CommentRouteContext) => {
    try {
        const commentId = await getCommentIdFromContext(context);
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                { status: 400 }
            );
        }

        if (!commentId || !Types.ObjectId.isValid(commentId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid commentId" }),
                { status: 400 }
            );
        }

        await connect();

        const result = await Like.findOneAndDelete({
            user: userId,
            comment: commentId
        });

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
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: "Failed to unlike comment", error: error.message }),
            { status: 500 }
        );
    }
};
