import { NextResponse } from "next/server"
import connect from "@/lib/mongoose";
import Post from "@/models/Post";
import { Types } from "mongoose";
import Category from "@/models/Category";
import User from "@/models/User";


//VIEW posts
export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get("categoryId");
        const searchKeywords = searchParams.get("keywords") as string;
        const filter: any = {};

        if(searchKeywords) {
            filter.$or = [
                {
                    title: { $regex: searchKeywords, $options: "i"},
                },
                {
                    content: { $regex: searchKeywords, $options: "i"},
                }
            ]
        }
        
        if (categoryId && !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid categoryId format" }),
                { status: 400 }
            );
        }


        await connect();

        if (categoryId) {
            const category = await Category.findById(categoryId);

            if (!category) {
                return new NextResponse(
                    JSON.stringify({ message: "Category not found" }),
                    { status: 404 }
                );
            }

            filter.category = new Types.ObjectId(categoryId);
        }
        
        const posts = await Post.find(filter);

        return new NextResponse(JSON.stringify({ posts }), { status: 200 });

    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: "Failed to get posts", error: error.message }),
            { status: 500 }
        );
    }
}

//CREATE
export const POST = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get("categoryId");
        const userId = searchParams.get("userId")
        const body = await request.json()
        const { title, slug, content } = body;

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: " Invalid or missing userId" }),
                { status: 400 }
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

        const user = await User.findById(userId)

        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            )
        }

        if(!user.is_superuser){
            return new NextResponse(
                JSON.stringify({ message: "Permission denied "}),
                { status: 401}
            )
        }

        const category = await Category.findById(categoryId)

        if (!category) {
            return new NextResponse(
                JSON.stringify({ message: "Category not found" }),
                { status: 404 }
            )
        }

        const newPost = new Post({
            title,
            slug,
            content,
            category: new Types.ObjectId(categoryId),
            user: new Types.ObjectId(userId)
        })
        await newPost.save();

        return new NextResponse(
            JSON.stringify({ message: "Post successfully created", post: newPost }),
            { status: 201 }
        )

    } catch (error: any) {
        return new NextResponse(
            JSON.stringify(`Failed to create post - ${error.message}`),
            { status: 500 }
        )
    }
}
