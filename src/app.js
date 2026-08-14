import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import crypto from "crypto";

import env from "../config/env.service.js";
import appRouter from "./app.controller.js";
import { notFound, errorHandler } from "./middleware/error-handler.js";
import { sanitizePayload } from "./middleware/sanitize.js";

const app = express();

app.disable("x-powered-by");

if (env.trustProxy) {
  app.set("trust proxy", 1);
}

app.use((req, res, next) => {
  req.requestId = req.headers["x-request-id"] || crypto.randomUUID();
  res.setHeader("x-request-id", req.requestId);
  next();
});

app.use(
  cors({
    origin: env.corsOrigins,
    credentials: true,
  }),
);
app.use(helmet());
app.use(cookieParser());
app.use(
  express.json({
    limit: env.bodyLimit,
    verify: (req, res, buffer) => {
      if (req.originalUrl === "/api/v1/orders/stripe/webhook") {
        req.rawBody = buffer;
      }
    },
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(sanitizePayload);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "3ssaf backend is running",
    documentationHint: "Use /api/v1 for API routes",
    health: "/api/v1/health",
    readiness: "/api/v1/ready",
  });
});

app.get("/health", (req, res) => {
  res.redirect(307, "/api/v1/health");
});

app.get("/ready", (req, res) => {
  res.redirect(307, "/api/v1/ready");
});

app.use("/api/v1", appRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
