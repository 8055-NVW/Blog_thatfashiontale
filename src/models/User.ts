import { Schema, model, models } from "mongoose";
import { UserType } from "@/types/UserType";

const UserSchema = new Schema<UserType>(
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

const User = models.User || model<UserType>("User", UserSchema);

export default User;