import { Schema, model, models } from "mongoose"
import { PostType } from "@/types/PostType"
import HotspotSchema from "./Hotspot"; 


const PostSchema = new Schema<PostType>(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true },
        content: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        image: { type: String },
        hotspots: [HotspotSchema],
    },
    {
        timestamps: true,
    }
)

const Post = models.Post || model<PostType>("Post", PostSchema)

export default Post