import fs from "fs";
import path from "path";
import multer from "multer";

import AppError from "../utils/app-error.js";

const isVercel = Boolean(process.env.VERCEL);

const ensureUploadsDir = () => {
  const uploadsDir = path.join(process.cwd(), "uploads");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  return uploadsDir;
};

const storage = isVercel
  ? multer.memoryStorage()
  : multer.diskStorage({
    destination: (req, file, cb) => cb(null, ensureUploadsDir()),
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const extension = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    }
  });

const imageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new AppError("Only jpg, png, and webp images are allowed", 400));
    }
    cb(null, true);
  }
});

const requirePersistentUploadStorage = (req, res, next) => {
  if (isVercel) {
    return next(new AppError("Avatar upload needs cloud storage on Vercel. Configure Cloudinary or another storage provider first", 501));
  }

  next();
};

export default imageUpload;
export {
  requirePersistentUploadStorage
};
