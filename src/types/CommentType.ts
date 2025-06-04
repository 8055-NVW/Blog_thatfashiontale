import { Types } from "mongoose";

export type CommentType = {
    post: Types.ObjectId;
    user: Types.ObjectId;
    parent?: Types.ObjectId | null;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}