import { Schema } from "mongoose"

const HotspotSchema = new Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    primary: {
      title: String,
      link: { type: String, required: true },
      image: String,
    },
    related: [
      {
        title: String,
        link: { type: String, required: true },
        image: String,
      },
    ],
  },
  { _id: false }
);

export default HotspotSchema;