import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";
import next from "next";

export interface IUser {
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}, 
},
{ timestamps: true}
);

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
     // Removed unnecessary next() call
})

const User = models?.User || model<IUser>("User", userSchema)

export default User