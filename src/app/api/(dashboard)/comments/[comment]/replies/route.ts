import { NextResponse } from "next/server"
import connect from "@lib/db";
import Comment from "@lib/modals/Comment";
import { Types } from "mongoose";

// GET replies
export const GET = async (request: Request, context: { params: any }) => {
    try {
        const commentId = await context.params.comment;

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
            .populate('user', 'display_name avatar_url')
            .sort({ createdAt: 1 });

        return new NextResponse(
            JSON.stringify({ replies }),
            { status: 200 }
        );

    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: "Failed to fetch replies", error: error.message }),
            { status: 500 }
        )
    }
}