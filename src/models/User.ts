import { Schema, model, models } from "mongoose";

interface User {
    email: string;
    name?: string;
    image?: string;
    googleId?: string;
    is_superuser?: boolean; 
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String },
        image: {type: String},
        googleId: { type: String },
        is_superuser: { type: Boolean, default: false}
    },
    {
        timestamps: true,
    }
)

const User = models.User || model<User>("User", UserSchema);

export default User;