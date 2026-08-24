import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

import { env } from "../config/index.js";

export interface JwtPayload {
  id: string;
  role: string;
}

export const generateAccessToken = (
  payload: JwtPayload,
): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as StringValue,
  });
};

export const verifyAccessToken = (
  token: string,
): JwtPayload => {
  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET,
  ) as JwtPayload;
};