import http from "http";
import mongoose from "mongoose";

import env from "../config/env.service.js";
import app from "./app.js";
import connectDB from "./database/connection.js";
import { closeSocket, initializeSocket } from "./modules/socket/socket.service.js";

let server;
let shuttingDown = false;

const shutdown = async (signal, exitCode = 0) => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  console.log(`Received ${signal}. Starting graceful shutdown`);

  const forceCloseTimer = setTimeout(() => {
    console.error("Graceful shutdown timed out");
    process.exit(1);
  }, env.gracefulShutdownTimeoutMs);

  forceCloseTimer.unref();

  try {
    await closeSocket();

    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    clearTimeout(forceCloseTimer);
    console.log("Graceful shutdown completed");
    process.exit(exitCode);
  } catch (error) {
    clearTimeout(forceCloseTimer);
    console.error("Failed during graceful shutdown", error);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();

  server = http.createServer(app);
  initializeSocket(server);

  server.listen(env.port, () => {
    console.log(`Server listening on port ${env.port} in ${env.nodeEnv} mode`);
  });
};

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection", error);
  shutdown("unhandledRejection", 1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception", error);
  shutdown("uncaughtException", 1);
});

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
