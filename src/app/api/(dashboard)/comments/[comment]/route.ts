import { NextResponse } from "next/server"
import connect from "@lib/db";
import Post from "@lib/modals/Post";
import Comment from "@lib/modals/Comment";
import { Types } from "mongoose";
import User from "@lib/modals/User";

//DELETE Comment
export const DELETE = async (request: Request, context: { params: any }) => {
    try {
        const commentId = await context.params.comment;
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId")

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                { status: 400 }
            )
        }

        if (!commentId || !Types.ObjectId.isValid(commentId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing postId" }),
                { status: 400 }
            )
        }

        await connect()

        const user = await User.findById(userId)

        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            )
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return new NextResponse(
                JSON.stringify({ message: "Comment not found" }),
                { status: 404 }
            );
        }

        if (user != comment.user._id) {
            return new NextResponse(
                JSON.stringify({ message: "Permission denied" }),
                { status: 404 }
            );
        }

        await Comment.findByIdAndDelete(commentId);
        return new NextResponse(
            JSON.stringify({ message: "Comment deleted"}),
            { status: 200 }
        );

    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: "Failed to delete post", error: error.message }),
            { status: 500 }
        )
    }
}