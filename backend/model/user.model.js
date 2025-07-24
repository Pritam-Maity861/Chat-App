import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other"],
        default: "male"
    },
    avatar: {
        type: String,

    },
    bio: {
        type: String
    },
    role: {
        type: String,
        enum: ["USER","ADMIN"],
        default: "USER"
    }

}, { timestamps: true })

const User = mongoose.model("User", userSchema);
export default User;