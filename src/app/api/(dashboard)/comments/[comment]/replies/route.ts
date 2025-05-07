import { NextResponse } from "next/server"
import connect from "@lib/db";
import Comment from "@lib/modals/Comment";
import User from "@lib/modals/User";
import { Types } from "mongoose";

//GET replies
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
            .populate("user", "username image")
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

// POST Reply
export const POST = async (request: Request, context: { params: any }) => {
    try {
        const commentId = await context.params.comment;
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const body = await request.json();
        const { content } = body;

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing userId" }),
                { status: 400 }
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

        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            )
        }

        const parentComment = await Comment.findById(commentId)

        if (!parentComment) {
            return new NextResponse(
                JSON.stringify({ message: "Parent comment not found" }),
                { status: 404 }
            )
        }

        const newReply = new Comment({
            post: parentComment.post,
            user: userId,
            parent: commentId,
            content: content.trim()
        });

        await newReply.save();

        await newReply.populate("user", "username image");
        
        return new NextResponse(
            JSON.stringify({
                message: "Comment successfully created",
                reply: newReply
            }),
            { status: 201 }
        )

    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: "Failed to create reply", error: error.message }),
            { status: 500 }
        )
    }
}