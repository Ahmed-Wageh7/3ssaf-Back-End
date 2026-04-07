import AppError from "../../utils/app-error.js";
import { uploadImageBuffer } from "../../common/cloudinary/cloudinary.js";

const getProfile = async (user) => ({ user });

const updateProfile = async (user, payload) => {
  if (payload.name !== undefined) user.name = payload.name;
  if (payload.phone !== undefined) user.phone = payload.phone;
  await user.save();

  return { message: "Profile updated", user };
};

const uploadAvatar = async (user, file) => {
  if (!file?.buffer) {
    throw new AppError("Avatar upload failed because no image file was received", 400);
  }

  const uploadResult = await uploadImageBuffer({
    buffer: file.buffer,
    folder: "ecommerce-backend/avatars",
    publicId: `user-${user._id}`
  });

  user.avatar = uploadResult.secure_url;
  await user.save();

  return { message: "Avatar uploaded", avatar: user.avatar };
};

const deleteProfile = async (user) => {
  user.isDeleted = true;
  user.deletedAt = new Date();
  await user.save();

  return { message: "Account soft deleted successfully" };
};

export default {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteProfile
};
