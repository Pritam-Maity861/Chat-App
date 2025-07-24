import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


export const uploadToCloudinary = async (filePath, fileName) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const ext = path.extname(fileName).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error("Invalid file type. Only image files are allowed.");
  }

 
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "user-doc",
    resource_type: "image", 
    use_filename: true,
    unique_filename: false,
    public_id: path.basename(fileName, ext), 
  });

 
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  return result.secure_url;
};
