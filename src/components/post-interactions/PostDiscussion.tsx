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
    <section className="space-y-6 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm">
      <DiscussionHeader count={comments.length} />
      {isSignedIn ? <CommentComposer postId={postId} /> : <SignInPrompt signInHref={signInHref} />}

      {comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center text-sm text-gray-600">
          No comments yet.
        </div>
      ) : (
        <CommentList comments={comments} isSignedIn={isSignedIn} signInHref={signInHref} />
      )}
    </section>
  );
}
