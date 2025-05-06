import { NextResponse } from "next/server"
import connect from "@lib/db";
import Post from "@lib/modals/Post";
import Comment from "@lib/modals/Comment";
import { Types } from "mongoose";

//DELETE Comment