import { Types } from "mongoose";

function buildPostLikeScope(postId: string) {
  return {
    post: new Types.ObjectId(postId),
    $or: [
      { comment: null },
      { comment: { $exists: false } },
    ],
  };
}

export function buildPostLikeLookup(userId: string, postId: string) {
  return {
    user: new Types.ObjectId(userId),
    ...buildPostLikeScope(postId),
  };
}

export function buildPostLikeCountLookup(postId: string) {
  return buildPostLikeScope(postId);
}

export function buildPostLikeDocument(userId: string, postId: string) {
  return {
    user: new Types.ObjectId(userId),
    post: new Types.ObjectId(postId),
    comment: null,
  };
}
