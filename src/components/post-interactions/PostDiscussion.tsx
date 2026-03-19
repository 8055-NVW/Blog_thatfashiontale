import CommentList from "./CommentList";
import CommentComposer from "./CommentComposer";
import DiscussionHeader from "./DiscussionHeader";
import SignInPrompt from "./SignInPrompt";
import { DiscussionComment } from "./types";

type PostDiscussionProps = {
  comments: DiscussionComment[];
  postId: string;
  isSignedIn: boolean;
  signInHref?: string;
};

export default function PostDiscussion({ comments, postId, isSignedIn, signInHref = "/signin" }: PostDiscussionProps) {
  return (
    <section className="space-y-6 rounded-xl border border-border bg-surface px-5 py-6 shadow-[var(--shadow-soft)] md:px-7 md:py-7">
      <DiscussionHeader count={comments.length} />
      {isSignedIn ? <CommentComposer postId={postId} /> : <SignInPrompt signInHref={signInHref} />}

      {comments.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-subtle px-5 py-8 text-center text-sm text-fg-muted">
          No comments yet.
        </div>
      ) : (
        <CommentList comments={comments} isSignedIn={isSignedIn} signInHref={signInHref} />
      )}
    </section>
  );
}
