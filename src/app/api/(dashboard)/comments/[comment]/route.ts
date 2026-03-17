import { NextResponse } from "next/server"
import { requireSessionUserId } from "@/lib/auth/requireSessionUserId";
import connect from "@/lib/mongoose";
import Comment from "@/models/Comment";
import Like from "@/models/Like";
import { Types } from "mongoose";

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Unknown error";
}

type CommentRouteContext = {
    params: Promise<{
        comment: string;
    }>;
};

//DELETE Comment
export const DELETE = async (request: Request, context: CommentRouteContext) => {
    try {
        const { comment: commentId } = await context.params;
        const userId = await requireSessionUserId();

        if (!userId) {
            return new NextResponse(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            )
        }

        if (!commentId || !Types.ObjectId.isValid(commentId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing postId" }),
                { status: 400 }
            )
        }

        await connect()

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return new NextResponse(
                JSON.stringify({ message: "Comment not found" }),
                { status: 404 }
            );
        }

        if (!comment.user.equals(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Permission denied: Only the comment author can delete this comment" }),
                { status: 403 }
            );
        }

        const commentObjectId = new Types.ObjectId(commentId);
        const replyIds = await Comment.find({ parent: commentObjectId }).distinct("_id");
        const idsToDelete = [commentObjectId, ...replyIds];

        await Promise.all([
            Comment.deleteMany({ _id: { $in: idsToDelete } }),
            Like.deleteMany({ comment: { $in: idsToDelete } }),
        ]);

        return new NextResponse(
            JSON.stringify({ message: "Comment deleted"}),
            { status: 200 }
        );

    } catch (error: unknown) {
        return new NextResponse(
            JSON.stringify({ message: "Failed to delete post", error: getErrorMessage(error) }),
            { status: 500 }
        )
    }
}
