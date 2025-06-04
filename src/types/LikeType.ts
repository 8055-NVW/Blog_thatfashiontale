import { Types } from "mongoose"

export type LikeType = {
    user:Types.ObjectId,
    post?:Types.ObjectId,
    comment?:Types.ObjectId,
    createdAt: Date
}