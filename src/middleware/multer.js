import multer from "multer";

import env from "../../config/env.service.js";
import AppError from "../utils/app-error.js";

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new AppError("Only jpg, png, and webp images are allowed", 400));
    }
    cb(null, true);
  }
});

const requireCloudinary = (req, res, next) => {
  if (!env.isCloudinaryConfigured) {
    return next(new AppError("Cloudinary is not configured. Add the Cloudinary environment variables first", 501));
  }

  next();
};

export default imageUpload;
export {
  requireCloudinary
};
