"use client";

import Link from "next/link";
import CommentLikeButton from "./CommentLikeButton";
import DeleteOwnButton from "./DeleteOwnButton";
import ReplyComposer from "./ReplyComposer";
import ReplyList from "./ReplyList";
import { DiscussionComment } from "./types";

function formatInteractionDate(date?: Date | string) {
  if (!date) {
    return null;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

type CommentItemProps = {
  comment: DiscussionComment;
  isSignedIn: boolean;
  signInHref: string;
  isReplying: boolean;
  onToggleReply: () => void;
  onCloseReply: () => void;
};

export default function CommentItem({
  comment,
  isSignedIn,
  signInHref,
  isReplying,
  onToggleReply,
  onCloseReply,
}: CommentItemProps) {
  const commentDate = formatInteractionDate(comment.createdAt);
  const replyCount = comment.replies?.length ?? 0;

  return (
    <article className="rounded-2xl border border-black/10 bg-[#fcfaf8] p-5">
      <div>
        <p className="font-medium text-gray-900">{comment.user?.name ?? "Reader"}</p>
        {commentDate ? <p className="text-sm text-gray-500">{commentDate}</p> : null}
      </div>
      <p className="mt-4 text-base leading-7 text-gray-800">{comment.content}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
        <CommentLikeButton
          commentId={comment._id}
          hasLiked={comment.hasLiked ?? false}
          isSignedIn={isSignedIn}
          likeCount={comment.likeCount ?? 0}
          signInHref={signInHref}
        />
        {isSignedIn ? (
          <button
            type="button"
            onClick={onToggleReply}
            className="font-medium text-gray-700 transition hover:text-gray-900"
          >
            {isReplying ? "Cancel reply" : "Reply"}
          </button>
        ) : (
          <Link
            href={signInHref}
            className="font-medium text-gray-700 underline decoration-gray-300 underline-offset-4 transition hover:text-gray-900 hover:decoration-gray-700"
          >
            Sign in to reply
          </Link>
        )}
        {comment.isOwner ? <DeleteOwnButton commentId={comment._id} itemLabel="comment" /> : null}
        {replyCount > 0 ? <span>{replyCount} {replyCount === 1 ? "reply" : "replies"}</span> : null}
      </div>

      {isSignedIn && isReplying ? <ReplyComposer commentId={comment._id} onSuccess={onCloseReply} /> : null}
      <ReplyList replies={comment.replies ?? []} isSignedIn={isSignedIn} signInHref={signInHref} />
    </article>
  );
}
