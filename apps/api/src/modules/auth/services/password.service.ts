import bcrypt from "bcrypt";

import { ApiError } from "../../../common/errors/ApiError.js";

import { authRepository } from "../repositories/auth.repository.js";

import { hashPassword } from "../utils/index.js";

import { resetToken } from "../../../common/security/reset-token.js";

import { mailService } from "../../mail/services/mail.service.js";

import { resetPasswordTemplate } from "../../mail/templates/reset-password.template.js";

import { env } from "../../../common/config/index.js";

import type {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "../dto/index.js";




export const passwordService = {
          async changePassword(
        userId: string,
        dto: ChangePasswordDto,
      ) {
        const user =
        await authRepository.findByIdWithPassword(userId);

        if (!user) {
          throw new ApiError(
            404,
            "User not found",
          );
        }

        const passwordMatches =
          await bcrypt.compare(
            dto.currentPassword,
            user.passwordHash,
          );

        if (!passwordMatches) {
          throw new ApiError(
            401,
            "Current password is incorrect",
          );
        }

        const passwordHash =
          await hashPassword(dto.newPassword);

        await authRepository.updatePassword(
          user.id,
          passwordHash,
        );

        return null;
      },


      async forgotPassword(
        dto: ForgotPasswordDto,
      ) {
        const user =
          await authRepository.findByEmailWithoutPassword(
            dto.email,
          );
        // Always return success to prevent email enumeration
        if (!user) {
          return null;
        }
      
        const rawToken = resetToken.generate();
      
        const hashedToken = resetToken.hash(
          rawToken,
        );
      
        const expiresAt = new Date(
          Date.now() +
            env.PASSWORD_RESET_TOKEN_TTL_MINUTES *
              60 *
              1000,
        );
      
        await authRepository.updateResetPasswordToken(
          user.id,
          hashedToken,
          expiresAt,
        );
      
        const resetLink =
          `${env.CLIENT_URL}/reset-password?token=${rawToken}`;
      
        const email =
          resetPasswordTemplate(resetLink);
      
        await mailService.send({
          to: user.email,
          subject: email.subject,
          html: email.html,
          text: email.text,
        });
      
        return null;
      },


      async resetPassword(
  dto: ResetPasswordDto,
) {
  const hashedToken =
    resetToken.hash(dto.token);

  const user =
    await authRepository.findByResetPasswordToken(
      hashedToken,
    );

  if (!user) {
    throw new ApiError(
      400,
      "Invalid or expired reset token",
    );
  }

  const samePassword =
    await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

  if (samePassword) {
    throw new ApiError(
      400,
      "New password must be different from your current password",
    );
  }

  const passwordHash =
    await hashPassword(dto.password);

  await authRepository.updatePassword(
    user.id,
    passwordHash,
  );

  await authRepository.clearResetPasswordToken(
    user.id,
  );

  return null;
},

};