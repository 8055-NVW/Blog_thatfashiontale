import { NextResponse } from "next/server"
import { requireSessionUserId } from "@/lib/auth/requireSessionUserId";
import connect from "@/lib/mongoose";
import Comment from "@/models/Comment";
import "@/models/User";
import { Types } from "mongoose";

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Unknown error";
}

type CommentRouteContext = {
    params: Promise<{
        comment: string;
    }>;
};

//GET replies
export const GET = async (request: Request, context: CommentRouteContext) => {
    try {
        const { comment: commentId } = await context.params;

        if (!commentId || !Types.ObjectId.isValid(commentId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid comment ID" }),
                { status: 400 }
            );
        }

        await connect();

        const parentComment = await Comment.findById(commentId);

        if (!parentComment) {
            return new NextResponse(
                JSON.stringify({ message: "Parent comment not found" }),
                { status: 404 }
            )
        }

        const replies = await Comment.find({ parent: commentId })
            .populate("user", "name image")
            .sort({ createdAt: 1 });

        return new NextResponse(
            JSON.stringify({ replies }),
            { status: 200 }
        );

    } catch (error: unknown) {
        return new NextResponse(
            JSON.stringify({ message: "Failed to fetch replies", error: getErrorMessage(error) }),
            { status: 500 }
        )
    }
}

// POST Reply
export const POST = async (request: Request, context: CommentRouteContext) => {
    try {
        const { comment: commentId } = await context.params;
        const userId = await requireSessionUserId();
        const body = await request.json();
        const { content } = body;

        if (!userId) {
            return new NextResponse(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            )
        }

        if (!commentId || !Types.ObjectId.isValid(commentId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing commentId" }),
                { status: 400 }
            )
        }

        if (!content) {
            return new NextResponse(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 }
            );
        }

        await connect();

        const parentComment = await Comment.findById(commentId)

        if (!parentComment) {
            return new NextResponse(
                JSON.stringify({ message: "Parent comment not found" }),
                { status: 404 }
            )
        }

        if (parentComment.parent) {
            return new NextResponse(
                JSON.stringify({ message: "Replies can only be created for top-level comments" }),
                { status: 400 }
            )
        }

        const newReply = new Comment({
            post: parentComment.post,
            user: new Types.ObjectId(userId),
            parent: new Types.ObjectId(commentId),
            content: content.trim()
        });

        await newReply.save();

        await newReply.populate("user", "name image");
        
        return new NextResponse(
            JSON.stringify({
                message: "Comment successfully created",
                reply: newReply
            }),
            { status: 201 }
        )

    } catch (error: unknown) {
        return new NextResponse(
            JSON.stringify({ message: "Failed to create reply", error: getErrorMessage(error) }),
            { status: 500 }
        )
    }
}
