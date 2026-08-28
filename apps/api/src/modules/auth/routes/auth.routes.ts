import { Router } from 'express';

import { asyncHandler } from '../../../common/errors/asyncHandler.js';

import { authenticate } from '../../../common/middleware/authenticate.js';

import { authController } from '../controllers/auth.controller.js';

const router = Router();

router.get('/me', authenticate, asyncHandler(authController.me));

router.post('/register', asyncHandler(authController.register));

router.post('/login', asyncHandler(authController.login));

router.post('/forgot-password', asyncHandler(authController.forgotPassword));

router.post('/logout', authenticate, asyncHandler(authController.logout));

router.patch('/change-password', authenticate, asyncHandler(authController.changePassword));

router.post('/reset-password', asyncHandler(authController.resetPassword));

router.post('/verify-email', asyncHandler(authController.verifyEmail));

router.post('/resend-verification', asyncHandler(authController.resendVerification));

router.post('/refresh', asyncHandler(authController.refresh));

export { router as authRoutes };
