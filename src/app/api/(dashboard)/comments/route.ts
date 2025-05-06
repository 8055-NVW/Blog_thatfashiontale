import { NextResponse } from "next/server"
import connect from "@lib/db";
import Post from "@lib/modals/Post";
import Comment from "@lib/modals/Comment";
import { Types } from "mongoose";

//GET Comments
export const GET = async (request: Request, context: {params: any}) => {
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get("postId");
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
        .populate('user', 'display_name avatar_url')
        .sort({ createdAt: -1 });

        return new NextResponse(JSON.stringify({comments}), {status: 200})
    } catch (error: any) {
        return new NextResponse("Error in fetching comments" + error.message, {
            status: 500,
        })
    }
}

//POST Comment

export const POST