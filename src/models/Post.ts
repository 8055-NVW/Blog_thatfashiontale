import { Schema, model, models} from "mongoose"
import { PostType } from "@/types/PostType"

const PostSchema = new Schema<PostType>(
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

const Post = models.Post || model<PostType>("Post", PostSchema)

export default Post