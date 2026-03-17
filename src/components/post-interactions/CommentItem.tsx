import { DiscussionComment } from "./types";

type CommentItemProps = {
  comment: DiscussionComment;
  formatDate: (date?: Date | string) => string | null;
};

export default function CommentItem({ comment, formatDate }: CommentItemProps) {
  const commentDate = formatDate(comment.createdAt);

  return (
    <article className="rounded-2xl border border-black/10 bg-[#fcfaf8] p-5">
      <div>
        <p className="font-medium text-gray-900">{comment.user?.name ?? "Reader"}</p>
        {commentDate ? <p className="text-sm text-gray-500">{commentDate}</p> : null}
      </div>
      <p className="mt-4 text-base leading-7 text-gray-800">{comment.content}</p>
    </article>
  );
}
