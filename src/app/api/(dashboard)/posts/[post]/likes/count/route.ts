import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connect from "@/lib/mongoose";
import { buildPostLikeCountLookup } from "@/lib/likes/postLike";
import Like from "@/models/Like";

export const GET = async (
  request: Request,
  context: { params: Promise<{ post: string }> }
) => {
  try {
    const { post: postId } = await context.params;

    if (!postId || !Types.ObjectId.isValid(postId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid postId" }),
        { status: 400 }
      );
    }
    
    await connect();

    const count = await Like.countDocuments(buildPostLikeCountLookup(postId));

    return NextResponse.json({ count });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "Failed to get like count",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
};
