import { ApiError } from "../../../common/errors/ApiError.js";

import { authRepository } from "../repositories/auth.repository.js";

import type { RegisterDto } from "../types/auth.types.js";

import bcrypt from "bcrypt";

import { hashPassword } from "../utils/index.js";

import { passwordService } from "./password.service.js";

import { env } from "../../../common/config/index.js";

import {
  sessionRepository,
} from "../../sessions/index.js";

import {
  refreshToken,
} from "../../../common/security/refresh-token.js";

import {
  getExpirationDate,
} from "../../../common/security/expiration.js";

import type {
  LoginDto,
  ChangePasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  ResendVerificationDto,
} from "../dto/index.js";

import { verificationService } from "./verification.service.js";

import { mailService } from "../../mail/services/mail.service.js";

import { toPublicUser } from "../../users/mappers/index.js";

import { tokenService } from "../../../common/security/token.service.js";

import type { ForgotPasswordDto } from "../dto/forgot-password.dto.js";

export const authService = {
  async register(dto: RegisterDto) {
    const existingUser = await authRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ApiError(409, "Email already exists");
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await authRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email.toLowerCase(),
      passwordHash,
    });

    /*
     * Email verification is optional.
     *
     * When EMAIL_ENABLED=false:
     * - User is created successfully
     * - No verification email is sent
     * - User can log in
     *
     * When EMAIL_ENABLED=true:
     * - SMTP must be configured
     * - Verification email is sent
     */
    if (mailService.isEnabled()) {
      if (!mailService.isConfigured()) {
        throw new ApiError(
          503,
          "Email service is not configured",
        );
      }

      await this.sendVerificationEmail({
        id: user.id,
        email: user.email,
      });
    }

    return toPublicUser(user);
  },

  async login(dto: LoginDto) {
    const user = await authRepository.findByEmail(dto.email);

    if (!user) {
      throw new ApiError(
        401,
        "Invalid email or password",
      );
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new ApiError(
        401,
        "Invalid email or password",
      );
    }

    /*
     * Email verification is only required when
     * the email system is enabled.
     *
     * EMAIL_ENABLED=false:
     * User can log in without email verification.
     *
     * EMAIL_ENABLED=true:
     * User must verify their email before logging in.
     */
    if (
      mailService.isEnabled() &&
      !user.emailVerified
    ) {
      throw new ApiError(
        403,
        "Please verify your email before logging in",
      );
    }

    const accessToken =
      tokenService.generateAccessToken({
        id: user.id,
        role: user.role!,
      });

    const newRefreshToken =
  tokenService.generateRefreshToken({
    id: user.id,
  });

const refreshPayload =
  tokenService.verifyRefreshToken(
    newRefreshToken,
  );

await sessionRepository.create({
  userId: user.id,
  tokenId: refreshPayload.jti,
  tokenHash:
    refreshToken.hash(newRefreshToken),
  expiresAt: getExpirationDate(
    env.JWT_REFRESH_EXPIRES_IN,
  ),
});

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: toPublicUser(user),
    };
  },

  async refresh(
  currentRefreshToken: string,
) {
  let payload;

  try {
    payload =
      tokenService.verifyRefreshToken(
        currentRefreshToken,
      );
  } catch {
    throw new ApiError(
      401,
      "Invalid refresh token",
    );
  }

  const session =
    await sessionRepository.findByTokenId(
      payload.jti,
    );

  if (!session) {
    throw new ApiError(
      401,
      "Invalid refresh token",
    );
  }

  if (session.revokedAt) {
    throw new ApiError(
      401,
      "Refresh token has been revoked",
    );
  }

  if (
    session.expiresAt.getTime() <=
    Date.now()
  ) {
    throw new ApiError(
      401,
      "Refresh token has expired",
    );
  }

  const expectedHash =
    refreshToken.hash(
      currentRefreshToken,
    );

  if (
    session.tokenHash !==
    expectedHash
  ) {
    throw new ApiError(
      401,
      "Invalid refresh token",
    );
  }

  const user =
    await authRepository.findById(
      payload.id,
    );

  if (!user) {
    throw new ApiError(
      401,
      "Invalid refresh token",
    );
  }

  /*
   * Rotate refresh token.
   *
   * The old session is immediately revoked.
   */
  await sessionRepository.revokeByTokenId(
    payload.jti,
  );

  const accessToken =
    tokenService.generateAccessToken({
      id: user.id,
      role: user.role!,
    });

  const newRefreshToken =
    tokenService.generateRefreshToken({
      id: user.id,
    });

  const newPayload =
    tokenService.verifyRefreshToken(
      newRefreshToken,
    );

  await sessionRepository.create({
    userId: user.id,
    tokenId: newPayload.jti,
    tokenHash:
      refreshToken.hash(
        newRefreshToken,
      ),
    expiresAt:
      getExpirationDate(
        env.JWT_REFRESH_EXPIRES_IN,
      ),
  });

  return {
    accessToken,
    refreshToken:
      newRefreshToken,
  };
},

  async sendVerificationEmail(user: {
    id: string;
    email: string;
  }) {
    return verificationService.sendVerificationEmail(
      user,
    );
  },

  async verifyEmail(dto: VerifyEmailDto) {
    return verificationService.verifyEmail(dto);
  },

  async resendVerification(
    dto: ResendVerificationDto,
  ) {
    return verificationService.resendVerification(
      dto,
    );
  },

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ) {
    return passwordService.changePassword(
      userId,
      dto,
    );
  },

  async forgotPassword(dto: ForgotPasswordDto) {
    return passwordService.forgotPassword(dto);
  },

  async resetPassword(dto: ResetPasswordDto) {
    return passwordService.resetPassword(dto);
  },

async logout(currentRefreshToken: string) {
  let payload;

  try {
    payload =
      tokenService.verifyRefreshToken(
        currentRefreshToken,
      );
  } catch {
    throw new ApiError(
      401,
      "Invalid refresh token",
    );
  }

  const session =
    await sessionRepository.findByTokenId(
      payload.jti,
    );

  if (!session) {
    throw new ApiError(
      401,
      "Invalid refresh token",
    );
  }

  if (session.revokedAt) {
    throw new ApiError(
      401,
      "Refresh token has been revoked",
    );
  }

  if (
    session.expiresAt.getTime() <=
    Date.now()
  ) {
    throw new ApiError(
      401,
      "Refresh token has expired",
    );
  }

  const expectedHash =
    refreshToken.hash(
      currentRefreshToken,
    );

  if (
    session.tokenHash !==
    expectedHash
  ) {
    throw new ApiError(
      401,
      "Invalid refresh token",
    );
  }

  await sessionRepository.revokeByTokenId(
    payload.jti,
  );

  return null;
},
};