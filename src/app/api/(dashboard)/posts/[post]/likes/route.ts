import connect from "@/lib/mongoose";
import { requireSessionUserId } from "@/lib/auth/requireSessionUserId";
import Like from "@/models/Like";
import Post from "@/models/Post";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

function isDuplicateKeyError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === 11000;
}

type PostRouteContext = {
  params: Promise<{
    post: string;
  }>;
};

async function getPostIdFromContext(context: PostRouteContext) {
  const { post } = await context.params;
  return post;
}

function buildPostLikeLookup(userId: string, postId: string) {
  return {
    user: new Types.ObjectId(userId),
    post: new Types.ObjectId(postId),
    $or: [
      { comment: null },
      { comment: { $exists: false } },
    ],
  };
}

function buildPostLikeDocument(userId: string, postId: string) {
  return {
    user: new Types.ObjectId(userId),
    post: new Types.ObjectId(postId),
    comment: null,
  };
}

// GET: Check like status
export const GET = async (request: Request, context: PostRouteContext) => {
    try {
      const postId = await getPostIdFromContext(context);
      const userId = await requireSessionUserId();
  
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

      if (!userId) {
        return new NextResponse(
          JSON.stringify({ hasLiked: false }),
          { status: 200 }
        );
      }

      const likeFilter = buildPostLikeLookup(userId, postId);
  
      const like = await Like.findOne(likeFilter);
  
      return new NextResponse(
        JSON.stringify({ hasLiked: !!like }),
        { status: 200 }
      );

    } catch (error: unknown) {
      return new NextResponse(
        JSON.stringify({ message: "Error checking like status", error: getErrorMessage(error) }),
        { status: 500 }
      );
    }
  };

// POST: Like 
export const POST = async (request: Request, context: PostRouteContext) => {
    try {
      const postId = await getPostIdFromContext(context);
      const userId = await requireSessionUserId();

      if (!userId) {
        return new NextResponse(
          JSON.stringify({ message: "Unauthorized" }),
          { status: 401 }
        );
      }
  
      if (!postId || !Types.ObjectId.isValid(postId)) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid postId" }),
          { status: 400 }
        );
      }
  
      await connect();
  
      const post = await Post.findById(postId);
      if (!post) {
        return new NextResponse(
          JSON.stringify({ message: "Post not found" }),
          { status: 404 }
        );
      }

      const likeFilter = buildPostLikeLookup(userId, postId);
  
      const existingLike = await Like.findOne(likeFilter);
  
      if (existingLike) {
        return new NextResponse(
          JSON.stringify({ message: "Post already liked" }),
          { status: 409 }
        );
      }
  
      const newLike = new Like(buildPostLikeDocument(userId, postId));
  
      await newLike.save();
  
      return new NextResponse(
        JSON.stringify({ message: "Post liked successfully" }),
        { status: 201 }
      );
    } catch (error: unknown) {
      if (isDuplicateKeyError(error)) {
        return new NextResponse(
          JSON.stringify({ message: "Post already liked" }),
          { status: 409 }
        );
      }

      return new NextResponse(
        JSON.stringify({ message: "Failed to like post", error: getErrorMessage(error) }),
        { status: 500 }
      );
    }
  };

// DELETE: Unlike
export const DELETE = async (request: Request, context: PostRouteContext) => {
    try {
      const postId = await getPostIdFromContext(context);
      const userId = await requireSessionUserId();

      if (!userId) {
        return new NextResponse(
          JSON.stringify({ message: "Unauthorized" }),
          { status: 401 }
        );
      }
  
      if (!postId || !Types.ObjectId.isValid(postId)) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid postId" }),
          { status: 400 }
        );
      }
  
      await connect();

      const likeFilter = buildPostLikeLookup(userId, postId);
  
      const result = await Like.findOneAndDelete(likeFilter);
  
      if (!result) {
        return new NextResponse(
          JSON.stringify({ message: "Like not found" }),
          { status: 404 }
        );
      }
  
      return new NextResponse(
        JSON.stringify({ message: "Post unliked successfully" }),
        { status: 200 }
      );
    } catch (error: unknown) {
      return new NextResponse(
        JSON.stringify({ message: "Failed to unlike post", error: getErrorMessage(error) }),
        { status: 500 }
      );
    }
  };
