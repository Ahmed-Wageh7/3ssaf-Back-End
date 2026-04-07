import { v2 as cloudinary } from "cloudinary";

import env from "../../../config/env.service.js";
import AppError from "../../utils/app-error.js";

if (env.isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret
  });
}

const uploadImageBuffer = ({ buffer, folder, publicId, overwrite = true }) => new Promise((resolve, reject) => {
  if (!env.isCloudinaryConfigured) {
    reject(new AppError("Cloudinary is not configured", 501));
    return;
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder,
      public_id: publicId,
      overwrite,
      invalidate: overwrite,
      resource_type: "image"
    },
    (error, result) => {
      if (error) {
        reject(new AppError("Image upload to Cloudinary failed", 502));
        return;
      }

      resolve(result);
    }
  );

  uploadStream.end(buffer);
});

export {
  uploadImageBuffer
};
