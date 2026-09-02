import CommentLikeButton from "./CommentLikeButton";
import DeleteOwnButton from "./DeleteOwnButton";
import { DiscussionReply } from "./types";

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

type ReplyListProps = {
  replies: DiscussionReply[];
  isSignedIn: boolean;
  signInHref: string;
};

export default function ReplyList({ replies, isSignedIn, signInHref }: ReplyListProps) {
  if (replies.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3 border-l border-border pl-4 md:pl-5">
      {replies.map((reply) => {
        const replyDate = formatInteractionDate(reply.createdAt);

        return (
          <article key={reply._id} className="space-y-2 rounded-md border border-border bg-surface px-4 py-3">
            <div className="space-y-1">
              <p className="font-medium text-fg">{reply.user?.name ?? "Reader"}</p>
              {replyDate ? <p className="text-sm text-fg-subtle">{replyDate}</p> : null}
            </div>
            <p className="text-sm leading-7 text-fg md:text-base">{reply.content}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fg-muted">
              <CommentLikeButton
                commentId={reply._id}
                hasLiked={reply.hasLiked ?? false}
                isSignedIn={isSignedIn}
                likeCount={reply.likeCount ?? 0}
                signInHref={signInHref}
              />
              {reply.isOwner ? <DeleteOwnButton commentId={reply._id} itemLabel="reply" /> : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
