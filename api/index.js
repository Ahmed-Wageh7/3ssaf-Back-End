import app from "../src/app.js";
import connectDB from "../src/database/connection.js";

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
