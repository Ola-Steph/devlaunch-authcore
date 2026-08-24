import mongoose from "mongoose";

import { env } from "../config/index.js";
import { logger } from "../logger/logger.js";

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI);

    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.fatal(error, "Failed to connect to MongoDB");

    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();

  logger.info("MongoDB connection closed");
}