import {Schema, model, models, Types} from "mongoose"

interface Like {
    user:Types.ObjectId,
    post?:Types.ObjectId,
    comment?:Types.ObjectId,
    createdAt: Date
}

const LikeSchema = new Schema(
    {
        user: {type:Schema.Types.ObjectId, ref: "User", required: true},
        post: {type:Schema.Types.ObjectId, ref: "Post", default: null},
        comment: {type:Schema.Types.ObjectId, ref: "Comment", default: null},
    },
    {
        timestamps: true,
    }

)

// To ensure user can only like a comment/post once
LikeSchema.index({ user: 1, post: 1 }, { unique: true, sparse: true });
LikeSchema.index({ user: 1, comment: 1 }, { unique: true, sparse: true });

LikeSchema.pre('validate', function(next) {
    if ((this.post && this.comment) || (!this.post && !this.comment)) {
      next(new Error('The like should reference either a post OR a comment, not both or neither'));
    } else {
      next();
    }
  });
  
  const Like = models.Like || model<Like>("Like", LikeSchema);
  
  export default Like;