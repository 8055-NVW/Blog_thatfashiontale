import connect from "@/lib/mongoose";
import Like from "@/models/Like";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

// GET - Get like count for comment
export const GET = async (request: Request, context: { params: any }) => {
    try {
        const commentId = context.params.comment
        if (!commentId || !Types.ObjectId.isValid(commentId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid commentId" }),
                { status: 400 }
            );
        }

        await connect();

        const count = await Like.countDocuments({ comment: commentId })

        return new NextResponse(
            JSON.stringify({ count }),
            { status: 200 }
        )

    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: "Error in fetching like count", error: error.message }),
            { status: 500 }
        )
    }
}