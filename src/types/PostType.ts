import { Types } from "mongoose";

export type PostType = {
    title: string;
    slug: string;
    content: string;
    category: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}