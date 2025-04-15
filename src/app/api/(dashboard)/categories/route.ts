import { NextResponse } from "next/server"
import connect from "@lib/db";
import User from "@lib/modals/User";
import Category from "@lib/modals/Category";
import { Types } from "mongoose";



//view category
export const GET = async () => {
    try {
        await connect()
        const categories = await Category.find()
        return new NextResponse(JSON.stringify(categories), { status: 200 })
    } catch (error: any) {
        return new NextResponse("Failed to get categories -" + error.message,
            { status: 500 }
        )
    }
}

//create category
export const POST = async (request: Request) => {
    try {
        const body = await request.json()
        const { name, slug, description } = body;
        await connect()

        if (!name || !slug || !description) {
            return new NextResponse(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 }
            );
        }
        
        const newCategory = new Category({ name, slug, description });
        await newCategory.save()

        return new NextResponse(
            JSON.stringify({ message: "Category successfully created", category: newCategory }),
            { status: 201 }
        )
        
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify(`Failed to create category - ${error.message}`),
            { status: 500 }
        )
    }
}


export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        await connect();
        const { identifier, newName, newSlug, newDescription } = body; 
        const filter = { slug: identifier };
        
        const update = {
            name: newName,
            slug: newSlug,
            description: newDescription,
        };
        const updatedCategory = await Category.findOneAndUpdate(
            filter,
            update,
            { new: true }
        );

        if (!updatedCategory) {
            return new NextResponse(JSON.stringify({ message: "Category not found" }), { status: 404 });
        }

        return new NextResponse(
            JSON.stringify({ message: "Category successfully updated", category: updatedCategory }),
            { status: 200 }
        );

    } catch (error: any) {
        return new NextResponse(
            JSON.stringify(`Failed to update category - ${error.message}`),
            { status: 500 }
        );
    }
};

//delete category

export const DELETE = async (request : Request) => {
    try {
        const {categoryId} = await request.json();
        await connect();



        if (!categoryId) {
            return new NextResponse(
                JSON.stringify({ message: "Id not found" }),
                { status: 400 })
        }

        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        return new NextResponse(
            JSON.stringify({ message: "Category successfully deleted", category: deletedCategory }),
            { status: 200 }
        )

        
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify(`Failed to update category - ${error.message}`),
            { status: 500 }
        );
    }
}
