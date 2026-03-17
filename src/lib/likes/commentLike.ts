import { Types } from "mongoose";

function buildCommentLikeScope(commentId: string) {
  return {
    comment: new Types.ObjectId(commentId),
    $or: [
      { post: null },
      { post: { $exists: false } },
    ],
  };
}

export function buildCommentLikeLookup(userId: string, commentId: string) {
  return {
    user: new Types.ObjectId(userId),
    ...buildCommentLikeScope(commentId),
  };
}

export function buildCommentLikeCountLookup(commentId: string) {
  return buildCommentLikeScope(commentId);
}

export function buildCommentLikeDocument(userId: string, commentId: string) {
  return {
    user: new Types.ObjectId(userId),
    comment: new Types.ObjectId(commentId),
    post: null,
  };
}
