import {Schema, model, models, Types} from "mongoose"

interface Comment {
    post: Types.ObjectId;
    user: Types.ObjectId;
    //added parent for nested replies
    parent?: Types.ObjectId | null;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const CommentSchema = new Schema(
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

const  Comment = models.Comment || model<Comment>("Comment", CommentSchema);

export default Comment