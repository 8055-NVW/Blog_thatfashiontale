import { Schema, model, models, Types } from "mongoose"
import { LikeType } from "@/types/LikeType";

const LikeSchema = new Schema<LikeType>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", default: null },
    comment: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
  },
  {
    timestamps: true,
  }

)

LikeSchema.index({ user: 1, post: 1 }, { unique: true, sparse: true });
LikeSchema.index({ user: 1, comment: 1 }, { unique: true, sparse: true });

LikeSchema.pre('validate', function (next) {
  if ((this.post && this.comment) || (!this.post && !this.comment)) {
    next(new Error('Like should reference either a post OR a comment, not both or neither'));
  } else {
    next();
  }
});

const Like = models.Like || model<LikeType>("Like", LikeSchema);

export default Like;