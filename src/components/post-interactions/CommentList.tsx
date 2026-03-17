"use client";

import { useState } from "react";
import CommentItem from "./CommentItem";
import { DiscussionComment } from "./types";

type CommentListProps = {
  comments: DiscussionComment[];
  isSignedIn: boolean;
  signInHref: string;
};

export default function CommentList({ comments, isSignedIn, signInHref }: CommentListProps) {
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          isSignedIn={isSignedIn}
          signInHref={signInHref}
          isReplying={activeReplyCommentId === comment._id}
          onToggleReply={() => setActiveReplyCommentId((current) => current === comment._id ? null : comment._id)}
          onCloseReply={() => setActiveReplyCommentId(null)}
        />
      ))}
    </div>
  );
}
