import { NextResponse } from "next/server"
import connect from "@lib/db";
import Post from "@lib/modals/Post";
import Category from "@lib/modals/Category";
import { Types } from "mongoose";


//VIEW posts
export const GET = async () => {
    try {
        await connect();
        const posts = await Post.find();

        //!logic to filter by category
        // const filter: any ={
        //     category: new Types.ObjectId(categoryId)
        // }
        return new NextResponse(JSON.stringify(posts), { status: 200 })
        
    } catch (error: any) {
        return new NextResponse("Failed to get posts -" + error.message,
            { status: 500 }
        )
    }
}

//CREATE
export const POST = async(request: Request)=> {
    try {
        const body = await request.json()
        const{ title, slug, content} = body;
        await  connect();

        if (!title || !slug || !content) {
            return new NextResponse(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 }
            );
        }

        const newPost = new Post({title, slug, content})
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

//UPDATE

//DELETE