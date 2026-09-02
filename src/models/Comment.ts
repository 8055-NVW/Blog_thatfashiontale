import {Schema, model, models} from "mongoose"
import { CommentType } from "@/types/CommentType";

const CommentSchema = new Schema<CommentType>(
    {
        post: {type: Schema.Types.ObjectId, ref: "Post", required: true},
        user: {type: Schema.Types.ObjectId, ref: "User", required: true},
        parent: {type: Schema.Types.ObjectId, ref: "Comment", default: null},
        content: {type: String, required: true, trim: true,
            maxlength: 1000},
    },
    {
        timestamps: true,
    }
)
const  Comment = models.Comment || model<CommentType>("Comment", CommentSchema);

export default Comment