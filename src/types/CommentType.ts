import { Types } from "mongoose";

export type CommentType = {
    _id?: Types.ObjectId;
    post: Types.ObjectId;
    user: Types.ObjectId;
    parent?: Types.ObjectId | null;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}
