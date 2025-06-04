import { Types } from "mongoose";
import { HotspotType } from "./HotspotType";

export type PostType = {
    title: string;
    slug: string;
    content: string;
    category: Types.ObjectId;
    hotspots?: HotspotType[];
    createdAt?: Date;
    updatedAt?: Date;
}