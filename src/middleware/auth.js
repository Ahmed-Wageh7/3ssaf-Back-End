import jwt from "jsonwebtoken";

import env from "../../config/env.service.js";
import User from "../database/model/user.model.js";
import AppError from "../utils/app-error.js";
import asyncHandler from "../utils/async-handler.js";

const auth = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppError("Authorization token is required", 401);
  }

  let payload;

  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AppError("Access token expired", 401);
    }

    if (error.name === "JsonWebTokenError") {
      throw new AppError("Invalid access token", 401);
    }

    throw error;
  }

  const user = await User.findOne({ _id: payload.id });

  if (!user) {
    throw new AppError("User not found", 401);
  }

  req.user = user;
  req.auth = payload;

  next();
});

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }

    next();
  };

export { auth, authorize };
