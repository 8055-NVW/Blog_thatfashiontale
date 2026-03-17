import { NextResponse } from "next/server"
import { requireSessionUserId } from "@/lib/auth/requireSessionUserId";
import connect from "@/lib/mongoose";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import { Types } from "mongoose";

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Unknown error";
}

type PostRouteContext = {
    params: Promise<{
        post: string;
    }>;
}

//GET Comments
export const GET = async (request: Request, context: PostRouteContext) => {
    try {
        const { post: postId } = await context.params;
        const filter: { post?: Types.ObjectId } = {};

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
            .populate('user', 'name image')
            .sort({ createdAt: -1 });

        return new NextResponse(JSON.stringify({ comments }), { status: 200 })
    } catch (error: unknown) {
        return new NextResponse("Error in fetching comments" + getErrorMessage(error), {
            status: 500,
        })
    }
}

//POST Comment
export const POST = async (request: Request, context: PostRouteContext) => {
    try {
        const params = await context.params;
        const postId = params.post;
        const body = await request.json()
        const { content } = body;
        const userId = await requireSessionUserId();

        if (!userId) {
            return new NextResponse(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
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

    } catch (error: unknown) {
        return new NextResponse(
            JSON.stringify({ message: "Failed to create comment", error: getErrorMessage(error) }),
            { status: 500 }
        )
    }
}
