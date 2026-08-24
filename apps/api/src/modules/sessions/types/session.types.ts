import type { Types } from "mongoose";

export interface Session {
  userId: Types.ObjectId;

  tokenId: string;

  tokenHash: string;

  expiresAt: Date;

  revokedAt?: Date | null;

  lastUsedAt?: Date | null;

  ipAddress?: string;

  userAgent?: string;

  createdAt: Date;

  updatedAt: Date;
}