import connect from "@/lib/mongoose";
import { buildCommentLikeCountLookup } from "@/lib/likes/commentLike";
import Like from "@/models/Like";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Unknown error";
}

type CommentRouteContext = {
    params: Promise<{
        comment: string;
    }>;
};

// GET - Get like count for comment
export const GET = async (request: Request, context: CommentRouteContext) => {
    try {
        const { comment: commentId } = await context.params;
        if (!commentId || !Types.ObjectId.isValid(commentId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid commentId" }),
                { status: 400 }
            );
        }

        await connect();

        const count = await Like.countDocuments(buildCommentLikeCountLookup(commentId))

        return new NextResponse(
            JSON.stringify({ count }),
            { status: 200 }
        )

    } catch (error: unknown) {
        return new NextResponse(
            JSON.stringify({ message: "Error in fetching like count", error: getErrorMessage(error) }),
            { status: 500 }
        )
    }
}
