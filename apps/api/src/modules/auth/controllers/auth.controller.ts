import type { Request, Response } from 'express';

import {
  changePasswordSchema,
  forgotPasswordSchema,
  logoutSchema,
  refreshSchema,
  resetPasswordSchema,
  resendVerificationSchema,
  verifyEmailSchema,
} from '../dto/index.js';

import { loginSchema } from '../dto/login.dto.js';
import { registerSchema } from '../validators/index.js';

import { authService } from '../services/auth.service.js';

import { success } from '../../../common/utils/index.js';

export const authController = {
  async register(req: Request, res: Response) {
    const dto = registerSchema.parse(req.body);

    const user = await authService.register(dto);

    return success(res, user, 'Account created successfully', 201);
  },

  async login(req: Request, res: Response) {
    const dto = loginSchema.parse(req.body);

    const result = await authService.login(dto);

    return success(res, result, 'Login successful');
  },

  async me(req: Request, res: Response) {
    return success(res, req.user?.toJSON(), 'User retrieved successfully');
  },

  async refresh(req: Request, res: Response) {
    const dto = refreshSchema.parse(req.body);

    const result = await authService.refresh(dto.refreshToken);

    return success(res, result, 'Token refreshed successfully');
  },

  async logout(req: Request, res: Response) {
    const dto = logoutSchema.parse(req.body);

    await authService.logout(dto.refreshToken);

    return success(res, null, 'Logged out successfully');
  },

  async changePassword(req: Request, res: Response) {
    const dto = changePasswordSchema.parse(req.body);

    await authService.changePassword(req.user!.id, dto);

    return success(res, null, 'Password changed successfully');
  },

  async forgotPassword(req: Request, res: Response) {
    const dto = forgotPasswordSchema.parse(req.body);

    await authService.forgotPassword(dto);

    return success(res, null, 'If an account exists, a password reset email has been sent.');
  },

  async resetPassword(req: Request, res: Response) {
    const dto = resetPasswordSchema.parse(req.body);

    await authService.resetPassword(dto);

    return success(res, null, 'Password reset successfully');
  },

  async verifyEmail(req: Request, res: Response) {
    const dto = verifyEmailSchema.parse(req.body);

    await authService.verifyEmail(dto);

    return success(res, null, 'Email verified successfully');
  },

  async resendVerification(req: Request, res: Response) {
    const dto = resendVerificationSchema.parse(req.body);

    await authService.resendVerification(dto);

    return success(res, null, 'If an account exists, a verification email has been sent.');
  },
};
