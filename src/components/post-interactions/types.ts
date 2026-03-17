export type DiscussionComment = {
  _id: string;
  content: string;
  createdAt?: Date | string;
  user?: {
    _id?: string;
    name?: string;
  };
};
