import type { DiscussionComment, DiscussionReply } from "./types";

type DiscussionLikeStateInput = {
  countById: Map<string, number>;
  likedIds: Set<string>;
};

function applyReplyLikeState(replies: DiscussionReply[], likeState: DiscussionLikeStateInput) {
  return replies.map((reply) => ({
    ...reply,
    likeCount: likeState.countById.get(reply._id) ?? 0,
    hasLiked: likeState.likedIds.has(reply._id),
  }));
}

export function applyDiscussionLikeState(
  comments: DiscussionComment[],
  likeState: DiscussionLikeStateInput,
) {
  return comments.map((comment) => ({
    ...comment,
    likeCount: likeState.countById.get(comment._id) ?? 0,
    hasLiked: likeState.likedIds.has(comment._id),
    replies: applyReplyLikeState(comment.replies ?? [], likeState),
  }));
}

export function formatLikeCount(count: number) {
  return `${count} like${count === 1 ? "" : "s"}`;
}
