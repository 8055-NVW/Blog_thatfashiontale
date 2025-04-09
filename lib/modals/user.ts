import { Schema, model, models } from "mongoose";

interface User {
    email: string;
    username: string;
    password?: string;
    image?: string;
    googleId?: string; 
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        image: {type: String, default: '../../public/profile_placeholder.png'},
        googleId: { type: String },
    },
    {
        timestamps: true,
    }
)

const User = models.User || model<User>("User", UserSchema);

export default User;