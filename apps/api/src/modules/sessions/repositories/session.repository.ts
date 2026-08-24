import { SessionModel } from "../models/session.model.js";

export const sessionRepository = {
  async create(data: {
    userId: string;
    tokenId: string;
    tokenHash: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return SessionModel.create(data);
  },

  async findByTokenId(tokenId: string) {
    return SessionModel.findOne({
      tokenId,
    }).select(
      "+tokenHash",
    );
  },

  async revokeByTokenId(
    tokenId: string,
  ) {
    return SessionModel.findOneAndUpdate(
      {
        tokenId,
        revokedAt: null,
      },
      {
        revokedAt: new Date(),
      },
      {
        new: true,
      },
    );
  },

  async revokeAllForUser(
    userId: string,
  ) {
    return SessionModel.updateMany(
      {
        userId,
        revokedAt: null,
      },
      {
        revokedAt: new Date(),
      },
    );
  },

  async updateLastUsed(
    tokenId: string,
  ) {
    return SessionModel.findOneAndUpdate(
      {
        tokenId,
        revokedAt: null,
      },
      {
        lastUsedAt: new Date(),
      },
      {
        new: true,
      },
    );
  },

  async findActiveByUser(
    userId: string,
  ) {
    return SessionModel.find({
      userId,
      revokedAt: null,
      expiresAt: {
        $gt: new Date(),
      },
    }).sort({
      createdAt: -1,
    });
  },
};