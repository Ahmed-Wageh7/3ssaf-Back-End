import mongoose from "mongoose";

import env from "../../config/env.service.js";

let cachedConnection = globalThis.__mongooseConnection || null;
let cachedConnectionPromise = globalThis.__mongooseConnectionPromise || null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  if (cachedConnectionPromise) {
    await cachedConnectionPromise;
    return mongoose.connection;
  }

  cachedConnectionPromise = mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: env.mongoServerSelectionTimeoutMs
  });

  globalThis.__mongooseConnectionPromise = cachedConnectionPromise;

  try {
    cachedConnection = await cachedConnectionPromise;
    globalThis.__mongooseConnection = cachedConnection;
    console.log("MongoDB connected");
    return cachedConnection;
  } catch (error) {
    cachedConnectionPromise = null;
    globalThis.__mongooseConnectionPromise = null;
    throw error;
  }
};

export default connectDB;
