import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth";
import connect from "@/lib/mongoose";
import Post from "@/models/Post";
import { Types } from "mongoose";
import Category from "@/models/Category";
import "@/models/User";
import { normalizeHotspots } from "@/lib/hotspotNormalization";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

//VIEW posts
export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const searchKeywords = searchParams.get("keywords") as string;
    const categoryId = searchParams.get("categoryId");
    const filter: Record<string, unknown> = {};

    await connect();

    if (searchKeywords) {
      filter.$or = [
        { title: { $regex: searchKeywords, $options: "i" } },
        { content: { $regex: searchKeywords, $options: "i" } },
      ];
    }

    if (categoryId) {
      if (!Types.ObjectId.isValid(categoryId)) {
        return new NextResponse(
          JSON.stringify({ message: "Invalid categoryId format" }),
          { status: 400 }
        );
      }

      const categoryExists = await Category.exists({ _id: categoryId });
      if (!categoryExists) {
        return new NextResponse(
          JSON.stringify({ message: "Category not found" }),
          { status: 404 }
        );
      }

      filter.category = categoryId;
    }

    const posts = await Post.find(filter)
      .populate("category", "name slug")
      .populate("user", "name");

    return new NextResponse(JSON.stringify({ posts }), { status: 200 });
  } catch (error: unknown) {
    return new NextResponse(
      JSON.stringify({ message: "Failed to get posts", error: getErrorMessage(error) }),
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
    try {
        const session = await auth();
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get("categoryId");
        const body = await request.json()
        const { title, slug, content, image, hotspots } = body;

        if (!session?.user?.id || !session.user.is_superuser) {
            return new NextResponse(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 403 }
            )
        }

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing categoryId" }),
                { status: 400 }
            )
        }

        if (!title || !slug || !content) {
            return new NextResponse(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 }
            );
        }

        await connect();

        const category = await Category.findById(categoryId)

        if (!category) {
            return new NextResponse(
                JSON.stringify({ message: "Category not found" }),
                { status: 404 }
            )
        }
        const normalizedHotspots = normalizeHotspots(hotspots);

        const newPost = new Post({
            title,
            slug,
            content,
            category: new Types.ObjectId(categoryId),
            image,
            hotspots: normalizedHotspots,
            user: new Types.ObjectId(session.user.id)
        })
        await newPost.save();

        return new NextResponse(
            JSON.stringify({ message: "Post successfully created", post: newPost }),
            { status: 201 }
        )

    } catch (error: unknown) {
        return new NextResponse(
            JSON.stringify({ message: `Failed to create post - ${getErrorMessage(error)}` }),
            { status: 500 }
        )
    }
}
