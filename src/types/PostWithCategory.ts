import { PostType } from "./PostType";

export type PostWithCategory = Omit<PostType, "category" | "user"> & {
  _id: string;
  category: {
    _id: string;
    name: string;
  };
  user: {
    _id: string;
    name: string;
  };
};