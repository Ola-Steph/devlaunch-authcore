import mongoose, {
  Schema,
} from "mongoose";

import type { Session } from "../types/session.types.js";

const sessionSchema = new Schema<Session>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    tokenId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
      select: false,
    },

    expiresAt: {
      type: Date,
      required: true,
      
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    lastUsedAt: {
      type: Date,
      default: null,
    },

    ipAddress: {
      type: String,
      trim: true,
    },

    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * Automatically remove expired sessions.
 *
 * MongoDB's TTL monitor removes the document
 * after expiresAt has passed.
 */
sessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 },
);

export const SessionModel =
  mongoose.model<Session>(
    "Session",
    sessionSchema,
  );