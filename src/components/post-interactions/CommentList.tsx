import CommentItem from "./CommentItem";
import { DiscussionComment } from "./types";

type CommentListProps = {
  comments: DiscussionComment[];
  formatDate: (date?: Date | string) => string | null;
};

export default function CommentList({ comments, formatDate }: CommentListProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} formatDate={formatDate} />
      ))}
    </div>
  );
}
