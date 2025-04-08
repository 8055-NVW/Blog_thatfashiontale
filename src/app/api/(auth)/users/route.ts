import { NextResponse } from "next/server"
import connect from "@lib/db";
import User from "@lib/modals/user";
import { Types } from "mongoose";

// This will be used in the PATCH request to confirm the correct userId before proceeding(mongoose)
const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
    try {
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), { status: 200 })
    }
    catch (error: any) {
        return new NextResponse("Failed: " + error.message, { status: 500 })
    }
}

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connect();

        if (!body.email || !body.username || !body.password) {
            return new NextResponse("Missing required fields", { status: 400 });
        }
        const newUser = new User(body)
        await newUser.save()

        return new NextResponse(JSON.stringify({ message: "New user created", user: newUser })
            , { status: 201 }
        )
    } catch (error: any) {
        return new NextResponse("Failed to create new user : " + error.message, { status: 500 })
    }
}

export const PATCH = async (request: Request) => {
    try {
        const body = await request.json()
        const { userId, newUsername } = body;
        await connect();

        if (!userId || !newUsername) {
            return new NextResponse(
                JSON.stringify({ message: "Id or new Username not found" }),
                { status: 400 })
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid user ID" }),
                { status: 400 })
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { username: newUsername },
            { new: true }
        )

        if (!updatedUser) {
            return new NextResponse(
                JSON.stringify({ message: "User not found" }),
                { status: 400 }
            )
        }

        return new NextResponse(
            JSON.stringify({ massage: "Success. User Updated", user: updatedUser }),
            { status: 200 }
        )
    } catch (error: any) {
        return new NextResponse("Error in updating user -" + error.message,
            { status: 500 }
        )
    }
}

export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return new NextResponse(
                JSON.stringify({ message: "Id not found" }),
                { status: 400 })
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid user ID" }),
                { status: 400 })
        }

        await connect();

        const deletedUser = await User.findByIdAndDelete(
            new Types.ObjectId(userId)
        );

        if (!deletedUser) {
            return new NextResponse(
                JSON.stringify({ message: "User not found in database" }),
                { status: 400 }
            )
        }

        return new NextResponse(
            JSON.stringify({ message: "User successfully deleted", user: deletedUser }),
            { status: 200 }
        )

    } catch (error: any) {
        return new NextResponse("Error in deleting user -") + error.message,
            { status: 500 }
    }
}