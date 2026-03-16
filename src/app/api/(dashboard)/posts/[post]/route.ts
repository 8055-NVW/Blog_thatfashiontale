import { NextRequest, NextResponse } from "next/server"
import connect from "@/lib/mongoose";
import Post from "@/models/Post";
import { Types } from "mongoose";
import { auth } from "@/auth";

//GET SINGLE POST
export const GET = async (request: NextRequest, context: { params: { post: string } }) => {
    try {
        const { post: postId } = await context.params;

        if (!postId || !Types.ObjectId.isValid(postId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing postId" }),
                { status: 400 }
            );
        }

        await connect();

        const post = await Post.findById(postId)
            .populate("category", "name slug")
            .populate("user", "name email")

        if (!post) {
            return new NextResponse(
                JSON.stringify({ message: "Post not found" }),
                { status: 404 }
            )
        }
        return new NextResponse(JSON.stringify({ post }), { status: 200 })

    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: "Failed to get post", error: error.message }),
            { status: 500 }
        );
    }
}

// UPDATE post
export const PATCH = async (request: NextRequest, context: { params: {post: string} }) => {
  try {
    const session = await auth();
    const { post: postId } = await context.params;

    if (!session?.user?.id || !session.user.is_superuser) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 403 }
      );
    }

    if (!postId || !Types.ObjectId.isValid(postId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing postId" }),
        { status: 400 }
      );
    }

    const {title,slug,content,category,image,hotspots,}: {
      title: string;
      slug: string;
      content: string;
      category: string;
      image?: string;
      hotspots?: any[];
    } = await request.json();

    if (!title || !slug || !content) {
      return new NextResponse(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }
    console.log(category)
    if (!category || !Types.ObjectId.isValid(category)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing category" }),
        { status: 400 }
      );
    }

    await connect();

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, slug, content, category, image, hotspots },
      { new: true }
    );

    if (!updatedPost) {
      return new NextResponse(
        JSON.stringify({ message: "Post not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Post successfully updated",
      post: updatedPost,
    });

  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Failed to update post", error: error.message }),
      { status: 500 }
    );
  }
};

//DELETE
export const DELETE = async (request: NextRequest, context: { params: {post: string} }) => {
    try {
        const session = await auth();
        const { post: postId } = await context.params;

        if (!session?.user?.id || !session.user.is_superuser) {
            return new NextResponse(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 403 }
            );
        }

        if (!postId || !Types.ObjectId.isValid(postId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing postId" }),
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

        await Post.findByIdAndDelete(postId);

        return new NextResponse(
            JSON.stringify({ message: "Post deleted" }),
            { status: 200 }
        );

    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: "Failed to delete post", error: error.message }),
            { status: 500 }
        );
    }
}
