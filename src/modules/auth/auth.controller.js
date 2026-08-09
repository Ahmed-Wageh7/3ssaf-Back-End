import express from "express";
import rateLimit from "express-rate-limit";

import validate from "../../middleware/validate.js";
import asyncHandler from "../../utils/async-handler.js";
import {
  getClearRefreshTokenCookieOptions,
  getRefreshTokenCookieOptions,
  refreshTokenCookieName
} from "../../utils/refresh-cookie.js";
import authService from "./auth.service.js";
import { signupSchema, loginSchema, emailSchema, resetPasswordSchema } from "./auth.validation.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many auth requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false
});

router.use(authLimiter);

const sendAuthResponse = (res, statusCode, payload) => {
  const { refreshToken, ...responseBody } = payload;

  if (refreshToken) {
    res.cookie(refreshTokenCookieName, refreshToken, getRefreshTokenCookieOptions());
  }

  return res.status(statusCode).json(responseBody);
};

router.post("/signup", validate(signupSchema), asyncHandler(async (req, res) => {
  sendAuthResponse(res, 201, await authService.signup(req.body));
}));

router.post("/login", validate(loginSchema), asyncHandler(async (req, res) => {
  sendAuthResponse(res, 200, await authService.login(req.body));
}));

router.post("/refresh", asyncHandler(async (req, res) => {
  res.status(200).json(await authService.refreshAccessToken(req.cookies?.refreshToken));
}));

router.post("/logout", asyncHandler(async (req, res) => {
  res.clearCookie(refreshTokenCookieName, getClearRefreshTokenCookieOptions());
  res.status(200).json({ message: "Logged out successfully" });
}));

router.get("/verify-email/:token", asyncHandler(async (req, res) => {
  sendAuthResponse(res, 200, await authService.verifyEmail(req.params.token));
}));

router.post("/resend-verification", validate(emailSchema), asyncHandler(async (req, res) => {
  res.status(200).json(await authService.resendVerification(req.body.email));
}));

router.post("/forgot-password", validate(emailSchema), asyncHandler(async (req, res) => {
  res.status(200).json(await authService.forgotPassword(req.body.email));
}));

router.post("/reset-password/:token", validate(resetPasswordSchema), asyncHandler(async (req, res) => {
  res.status(200).json(await authService.resetPassword(req.params.token, req.body.password));
}));

export default router;
