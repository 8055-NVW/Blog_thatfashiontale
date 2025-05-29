import { Schema, models, model } from "mongoose"

interface Category {
    name: string;
    slug: string;
    description: string;
}

const CategorySchema = new Schema(
    {
        name:{type: String, required: true},
        slug: {type:String, required: true},
        description: {type:String, required: true },
    },
);

const Category = models.Category || model<Category>('Category', CategorySchema);

export default Category;