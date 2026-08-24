import crypto from "node:crypto";

export const refreshToken = {
  hash(token: string): string {
    return crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
  },
};