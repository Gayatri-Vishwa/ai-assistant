import { v2 as cloudinary } from "cloudinary";
import fs from "fs";          //delete files after upload on cloudinry,  that temperorily store in pulic folder

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });

  try {
    const uploadResult =await cloudinary.uploader
      .upload(filePath)
    
      fs.unlinkSync(filePath); //deleting file after upload
      return uploadResult.secure_url;
  

  } catch (error) {
    fs.unlinkSync(filePath); //deleting file even if error occurs
    console.error("Cloudinary upload error:", error);
  //  return res.status(500).json({ message: "Cloudinary upload failed" });
  }
};


export default uploadOnCloudinary;