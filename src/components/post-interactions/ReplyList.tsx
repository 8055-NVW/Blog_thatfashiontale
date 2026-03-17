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
};

export default function ReplyList({ replies }: ReplyListProps) {
  if (replies.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3 border-l border-black/10 pl-4 md:pl-5">
      {replies.map((reply) => {
        const replyDate = formatInteractionDate(reply.createdAt);

        return (
          <article key={reply._id} className="space-y-2 rounded-2xl bg-[#faf7f4] px-4 py-3">
            <div>
              <p className="font-medium text-gray-900">{reply.user?.name ?? "Reader"}</p>
              {replyDate ? <p className="text-sm text-gray-500">{replyDate}</p> : null}
            </div>
            <p className="text-sm leading-7 text-gray-800 md:text-base">{reply.content}</p>
          </article>
        );
      })}
    </div>
  );
}
