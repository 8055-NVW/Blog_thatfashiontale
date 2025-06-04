import connect from "@/lib/mongoose";
import Like from "@/models/Like";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

// GET - Get like count for post
export const GET = async (request: Request, context: { params: any }) => {
    try {
        const postId = context.params.post
        if (!postId || !Types.ObjectId.isValid(postId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid postId" }),
                { status: 400 }
            );
        }

        await connect();

        const count = await Like.countDocuments({ post: postId })

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