import connect from "@lib/db";
import Like from "@lib/modals/Like";
import Post from "@lib/modals/Post";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

// GET: Check like status
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

// POST: Like 
export const POST = async (request: Request, context: { params: any }) => {
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
  
      await connect();
  
      const post = await Post.findById(postId);
      if (!post) {
        return new NextResponse(
          JSON.stringify({ message: "Post not found" }),
          { status: 404 }
        );
      }
  
      const existingLike = await Like.findOne({
        user: userId,
        post: postId
      });
  
      if (existingLike) {
        return new NextResponse(
          JSON.stringify({ message: "Post already liked" }),
          { status: 409 }
        );
      }
  
      const newLike = new Like({
        user: userId,
        post: postId
      });
  
      await newLike.save();
  
      return new NextResponse(
        JSON.stringify({ message: "Post liked successfully" }),
        { status: 201 }
      );
    } catch (error: any) {
      return new NextResponse(
        JSON.stringify({ message: "Failed to like post", error: error.message }),
        { status: 500 }
      );
    }
  };

// DELETE: Unlike
export const DELETE = async (request: Request, context: { params: any }) => {
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
  
      await connect();
  
      const result = await Like.findOneAndDelete({
        user: userId,
        post: postId
      });
  
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
    } catch (error: any) {
      return new NextResponse(
        JSON.stringify({ message: "Failed to unlike post", error: error.message }),
        { status: 500 }
      );
    }
  };