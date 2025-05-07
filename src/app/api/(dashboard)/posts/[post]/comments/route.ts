import { NextResponse } from "next/server"
import connect from "@lib/db";
import Post from "@lib/modals/Post";
import Comment from "@lib/modals/Comment";
import { Types } from "mongoose";
import User from "@lib/modals/User";

//GET Comments
export const GET = async (request: Request, context: { params: any }) => {
    try {
        // const { searchParams } = new URL(request.url);
        // const postId = searchParams.get("postId");
        const postId = await context.params.post;
        const filter: any = {};

        if (!postId || !Types.ObjectId.isValid(postId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing postId" }),
                { status: 400 }
            )
        }

        await connect()

        if (postId) {
            const post = await Post.findById(postId);

            if (!post) {
                return new NextResponse(
                    JSON.stringify({ message: "Post not found" }),
                    { status: 404 }
                );
            }

            filter.post = new Types.ObjectId(postId)
        }

        const comments = await Comment.find(filter)
            .populate('user', 'username image')
            .sort({ createdAt: -1 });

        return new NextResponse(JSON.stringify({ comments }), { status: 200 })
    } catch (error: any) {
        return new NextResponse("Error in fetching comments" + error.message, {
            status: 500,
        })
    }
}

//POST Comment
export const POST = async (request: Request, context: { params: any }) => {
    try {
        const params = await context.params;
        const postId = params.post;
        const body = await request.json()
        const { content } = body;
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId")

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: " Invalid or missing userId" }),
                { status: 400 }
            )
        }
        
        if (!postId || !Types.ObjectId.isValid(postId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing postId" }),
                { status: 400 }
            )
        }
        
        if (!content) {
            return new NextResponse(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 }
            );
        }
        await connect()

        const user = await User.findById(userId)
        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            )
        }

        const post = await Post.findById(postId)

        if (!post) {
            return new NextResponse(
                JSON.stringify({ message: "Post not found" }),
                { status: 404 }
            )
        }

        const newComment = new Comment({
            content,
            post: new Types.ObjectId(postId),
            user: new Types.ObjectId(userId)
        })
        await newComment.save();

        return new NextResponse(
            JSON.stringify({ message: "Comment successfully created", comment: newComment },
            ),
            { status: 201 }
        )

    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: "Failed to create post", eror: error.message }),
            { status: 500 }
        )
    }
}