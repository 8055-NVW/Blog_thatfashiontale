export type DiscussionReply = {
  _id: string;
  content: string;
  createdAt?: Date | string;
  likeCount?: number;
  hasLiked?: boolean;
  user?: {
    _id?: string;
    name?: string;
  };
};

export type DiscussionComment = DiscussionReply & {
  replies?: DiscussionReply[];
};
