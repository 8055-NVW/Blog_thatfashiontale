import { Schema, model, models, Types } from "mongoose"

interface Post {
    title: string;
    slug: string;
    content: string;
    category: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const PostSchema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true },
        content: { type: String, required: true },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true }
    },
    {
        timestamps: true,
    }
)

const Post = models.Post || model<Post>("Post", PostSchema)

export default Post