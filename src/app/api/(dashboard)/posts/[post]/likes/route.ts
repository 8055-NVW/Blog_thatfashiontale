import connect from "@lib/db";
import Like from "@lib/modals/Like";
import Post from "@lib/modals/Post";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request, context: { params: any }) => {
    try {
      const postId = await context.params.post;
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get("userId");
  
      if (!userId || !Types.ObjectId.isValid(userId)) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid or missing userId" }),
          { status: 400 }
        );
      }
  
      if (!postId || !Types.ObjectId.isValid(postId)) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid postId" }),
          { status: 400 }
        );
      }
  
      await connect()
  
      const post = await Post.findById(postId);
      if (!post) {
        return new NextResponse(
          JSON.stringify({ message: "Post not found" }),
          { status: 404 }
        );
      }
  
      const like = await Like.findOne({
        user: userId,
        post: postId
      });
  
      return new NextResponse(
        JSON.stringify({ hasLiked: !!like }),
        { status: 200 }
      );

    } catch (error: any) {
      return new NextResponse(
        JSON.stringify({ message: "Error checking like status", error: error.message }),
        { status: 500 }
      );
    }
  };