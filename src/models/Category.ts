import { Schema, models, model } from "mongoose"
import { CategoryType } from "@/types/CategoryType";

const CategorySchema = new Schema<CategoryType>(
    {
        name:{type: String, required: true},
        slug: {type:String, required: true},
        description: {type:String, required: true },
    },
);

const Category = models.Category || model<CategoryType>('Category', CategorySchema);

export default Category;