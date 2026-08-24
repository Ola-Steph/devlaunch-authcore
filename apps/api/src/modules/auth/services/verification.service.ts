import { ApiError } from "../../../common/errors/ApiError.js";

import { authRepository } from "../repositories/auth.repository.js";

import { resetToken } from "../../../common/security/reset-token.js";

import { mailService } from "../../mail/services/mail.service.js";

import { verifyEmailTemplate } from "../../mail/templates/verify-email.template.js";

import { env } from "../../../common/config/index.js";



import type {
  VerifyEmailDto,
  ResendVerificationDto,
} from "../dto/index.js";

export const verificationService = {
async sendVerificationEmail(
        user: {
          id: string;
          email: string;
        },
      ) {
        const rawToken = resetToken.generate();

        const hashedToken =
          resetToken.hash(rawToken);

        const expiresAt = new Date(
          Date.now() +
            env.EMAIL_VERIFICATION_TOKEN_TTL_MINUTES *
              60 *
              1000,
        );

        await authRepository.updateVerificationToken(
          user.id,
          hashedToken,
          expiresAt,
        );

        const verificationLink =
          `${env.CLIENT_URL}/verify-email?token=${rawToken}`;

        const email =
          verifyEmailTemplate(
            verificationLink,
          );

        await mailService.send({
          to: user.email,
          subject: email.subject,
          html: email.html,
          text: email.text,
        });
},




        async verifyEmail(
          dto: VerifyEmailDto,
        ) {
          const hashedToken =
            resetToken.hash(dto.token);
        
          const user =
            await authRepository.findByVerificationToken(
              hashedToken,
            );
        
          if (!user) {
            throw new ApiError(
              400,
              "Invalid or expired verification token",
            );
          }
        
          if (user.emailVerified) {
            return null;
          }
        
          await authRepository.verifyEmail(
            user.id,
          );
        
          await authRepository.clearVerificationToken(
            user.id,
          );
        
          return null;
        },
        





            async resendVerification(
              dto: ResendVerificationDto,
            ) {
              const user =
                await authRepository.findByEmail(
                  dto.email,
                );
            
              // Prevent email enumeration
              if (!user) {
                return null;
              }
            
              if (user.emailVerified) {
                return null;
              }
            
              await this.sendVerificationEmail({
                id: user.id,
                email: user.email,
              });
            
              return null;
            },

};