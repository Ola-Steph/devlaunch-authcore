import jwt, {
  type Secret,
  type SignOptions,
} from "jsonwebtoken";

import { randomUUID } from "node:crypto";

import { env } from "../config/index.js";

export interface AccessTokenPayload {
  id: string;
  role: string;
}

export interface RefreshTokenPayload {
  id: string;
  jti: string;
}

const accessSecret: Secret =
  env.JWT_ACCESS_SECRET;

const refreshSecret: Secret =
  env.JWT_REFRESH_SECRET;

function signJwt<T extends object>(
  payload: T,
  secret: Secret,
  expiresIn: string,
): string {
  return jwt.sign(
    payload,
    secret,
    {
      expiresIn,
    } as SignOptions,
  );
}

export const tokenService = {
  generateAccessToken(
    payload: AccessTokenPayload,
  ): string {
    return signJwt(
      payload,
      accessSecret,
      env.JWT_ACCESS_EXPIRES_IN,
    );
  },

  generateRefreshToken(
    payload: Omit<
      RefreshTokenPayload,
      "jti"
    >,
  ): string {
    return signJwt(
      {
        ...payload,
        jti: randomUUID(),
      },
      refreshSecret,
      env.JWT_REFRESH_EXPIRES_IN,
    );
  },

  verifyAccessToken(
    token: string,
  ): AccessTokenPayload {
    return jwt.verify(
      token,
      accessSecret,
    ) as AccessTokenPayload;
  },

  verifyRefreshToken(
    token: string,
  ): RefreshTokenPayload {
    return jwt.verify(
      token,
      refreshSecret,
    ) as RefreshTokenPayload;
  },

  getRefreshTokenPayload(
    token: string,
  ): RefreshTokenPayload {
    return jwt.verify(
      token,
      refreshSecret,
    ) as RefreshTokenPayload;
  },
};