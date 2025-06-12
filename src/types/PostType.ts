import { Types } from "mongoose";
import { HotspotType } from "./HotspotType";

export type PostType = {
    title: string;
    slug: string;
    content: string;
    user: Types.ObjectId
    category: Types.ObjectId;
    image?: string,
    hotspots?: HotspotType[];
    createdAt?: Date;
    updatedAt?: Date;
}

export type PostFormType = {
  title: string;
  slug: string;
  content: string;
  image?: string;
  category: string;
  user: string;
  hotspots: HotspotType[];
};
