import { uploadToCloudinary } from "../lib/cloudinary.lib.js";
import User from "../model/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import fs from "fs";


//get all the user..
export const getAllUser = asyncHandler(async (req, res) => {
  const getAllUser = await User.find().select("-password");

  if (!getAllUser || getAllUser.length === 0) {
    throw new ApiError(404, "no user aviable");
  }

  res.status(200).json(new ApiResponse(200, getAllUser, "All user fetched successfully"));
}
)

//get a single user..
export const getSingleUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    throw new ApiError(400, "userId not found");
  }
  const getOneUser = await User.findById(id).select("-password");

  if (!getOneUser) {
    throw new ApiError(404, "user not found");
  }

  res.status(200).json(new ApiResponse(200, getOneUser, "user fetched successfully"));
}
)

//delete user
export const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    throw new ApiError(400, "userId not found");
  }
  const deleteUser = await User.findByIdAndDelete(id);

  if (!deleteUser) {
    throw new ApiError(404, "something went wrong while deleteing user");
  }

  res.status(200).json(new ApiResponse(200, "user deleted successfully"));
}
)


//get all other user except loginedUser...
export const getOtherUser = asyncHandler(async (req, res) => {
  const otherUser = await User.find({ _id: { $ne: req.userId } });
 

  res.status(200).json(new ApiResponse(200, otherUser, "other users fetched successfully."));
}
)


//update user details...
export const updateUser=asyncHandler(async (req,res) => {
  const userId=req.userId;
  if(!userId){
    throw new ApiError(401,"Unauthorized! User not found.")
  }
  const { username, email, bio } = req.body;

  if (!username && !email && !bio && !req.file) {
    throw new ApiError(400, "Please provide at least one field to update");
  }

  const updateData = {};
  if (username) updateData.username = username.trim().toLowerCase();
  if (email) updateData.email = email?.replace(/\s+/g, "").toLowerCase();
  if (bio) updateData.bio = bio;

  if (req.file) {
    try {
      const imageUrl = await uploadToCloudinary(req.file.path, req.file.originalname);
      updateData.avatar = imageUrl;
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      throw new ApiError(400, err.message || "Avatar upload failed");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password");

  console.log(updateUser);

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedUser, "Profile updated successfully")
  );
}
)