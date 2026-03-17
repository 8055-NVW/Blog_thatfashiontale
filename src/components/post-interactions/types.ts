export type DiscussionReply = {
  _id: string;
  content: string;
  createdAt?: Date | string;
  user?: {
    _id?: string;
    name?: string;
  };
};

export type DiscussionComment = DiscussionReply & {
  replies?: DiscussionReply[];
};
