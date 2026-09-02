import type { DiscussionComment, DiscussionReply } from "./types";

function applyReplyOwnershipState(replies: DiscussionReply[], userId?: string) {
  return replies.map((reply) => ({
    ...reply,
    isOwner: Boolean(userId) && reply.user?._id === userId,
  }));
}

export function applyDiscussionOwnershipState(comments: DiscussionComment[], userId?: string) {
  return comments.map((comment) => ({
    ...comment,
    isOwner: Boolean(userId) && comment.user?._id === userId,
    replies: applyReplyOwnershipState(comment.replies ?? [], userId),
  }));
}
