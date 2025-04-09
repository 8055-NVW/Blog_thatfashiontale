import { Schema, models, model } from "mongoose"

const CategorySchema = new Schema(
    {
        name:{type: String, required: true},
        slug: {type:String, required: true},
        description: {type:String, required: true },
    },
    {
        timestamps: true
    }
);

const Category = models.Category || model('Category', CategorySchema);

export default Category;