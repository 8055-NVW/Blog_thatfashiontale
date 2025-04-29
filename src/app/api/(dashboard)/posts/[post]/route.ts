import { NextResponse } from "next/server"
import connect from "@lib/db";
import Post from "@lib/modals/Post";
import { Types } from "mongoose";
import Category from "@lib/modals/Category";
import User from "@lib/modals/User";

//GET SINGLE POST
export const GET = async (request: Request, context: {params: any}) => {
    try {
        const params = await context.params;
        const postId = params.post;
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get("categoryId");

        if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing categoryId" }),
                { status: 400 }
            )
        }

        if (!postId || !Types.ObjectId.isValid(postId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing postId" }),
                { status: 400 }
            )
        }

        await connect();

        const category = await Category.findById(categoryId)

        if (!category) {
            return new NextResponse(
                JSON.stringify({ message: "Category not found" }),
                { status: 404 }
            )
        }

        const post = await Post.findOne({
            _id: postId,
            category: categoryId,
        })

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

//UPDATE
export const PATCH = async (request: Request, context: {params: any}) => {
    try {
        const params = await context.params;
        const postId = params.post;
        const body = await request.json()
        const { title, slug, content } = body;
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId")

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: " Invalid or missing userId" }),
                { status: 400 }
            )
        }

        if (!title || !slug || !content) {
            return new NextResponse(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 }
            );
        }

        
        if (!postId || !Types.ObjectId.isValid(postId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing postId" }),
                { status: 400 }
            )
        }
        
        await connect()

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
                { status: 403}
            )
        }

        const post = await Post.findById(postId)

        if (!post) {
            return new NextResponse(
                JSON.stringify({ message: "Post not found" }),
                { status: 404 }
            )
        }

        
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {title, slug,content},
            {new: true}
        )
        

        return new NextResponse(
            JSON.stringify({ message: "Post successfully updated", post: updatedPost }),
            { status: 200 }
        );
        
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: "Failed to update post", error: error.message }),
            { status: 500 }
        );       
    }
 }


//DELETE
export const DELETE = async (request: Request, context: {params: any}) => {
    try {
        const params = await context.params;
        const postId = params.post;
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId")

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: " Invalid or missing userId" }),
                { status: 400 }
            )
        }

        if (!postId || !Types.ObjectId.isValid(postId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid or missing postId" }),
                { status: 400 }
            )
        }

        await connect()

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
                { status: 403}
            )
        }

        const post = await Post.findById(postId);
        if (!post) {
            return new NextResponse(
                JSON.stringify({ message: "Post not found" }),
                { status: 404 }
            );
        }
        
        await Post.findByIdAndDelete(postId);

        return new NextResponse(
            JSON.stringify({ message: "Post deleted"}),
            { status: 200 }
        );
        
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: "Failed to delete post", error: error.message }),
            { status: 500 }
        );        
    }
}