import { NextRequest, NextResponse } from "next/server"
import connect from "@/lib/mongoose";
import Post from "@/models/Post";
import "@/models/Category";
import "@/models/User";
import { Types } from "mongoose";
import { auth } from "@/auth";
import { normalizeHotspots } from "@/lib/hotspotNormalization";

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Unknown error";
}

type PostRouteContext = {
    params: Promise<{
        post: string;
    }>;
};

//GET SINGLE POST
export const GET = async (request: NextRequest, context: PostRouteContext) => {
    try {
        const { post: postIdentifier } = await context.params;

        if (!postIdentifier) {
            return new NextResponse(
                JSON.stringify({ message: "Missing post identifier" }),
                { status: 400 }
            );
        }

        await connect();

        const post = await Post.findOne(
            Types.ObjectId.isValid(postIdentifier)
                ? { $or: [{ _id: postIdentifier }, { slug: postIdentifier }] }
                : { slug: postIdentifier }
        )
            .populate("category", "name slug")
            .populate("user", "name email")

        if (!post) {
            return new NextResponse(
                JSON.stringify({ message: "Post not found" }),
                { status: 404 }
            )
        }
        return new NextResponse(JSON.stringify({ post }), { status: 200 })

    } catch (error: unknown) {
        return new NextResponse(
            JSON.stringify({ message: "Failed to get post", error: getErrorMessage(error) }),
            { status: 500 }
        );
    }
}

// UPDATE post
export const PATCH = async (request: NextRequest, context: PostRouteContext) => {
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
      hotspots?: unknown[];
    } = await request.json();

    if (!title || !slug || !content) {
      return new NextResponse(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }
    if (!category || !Types.ObjectId.isValid(category)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing category" }),
        { status: 400 }
      );
    }

    const normalizedHotspots = normalizeHotspots(hotspots);

    await connect();

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, slug, content, category, image, hotspots: normalizedHotspots },
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

  } catch (error: unknown) {
    return new NextResponse(
      JSON.stringify({ message: "Failed to update post", error: getErrorMessage(error) }),
      { status: 500 }
    );
  }
};

//DELETE
export const DELETE = async (request: NextRequest, context: PostRouteContext) => {
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

    } catch (error: unknown) {
        return new NextResponse(
            JSON.stringify({ message: "Failed to delete post", error: getErrorMessage(error) }),
            { status: 500 }
        );
    }
}
