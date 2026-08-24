import type {
  UserRole,
  UserStatus,
} from "../../../common/constants/user.constants.js";

/**
 * Raw MongoDB user document shape.
 * Defaults are optional because Mongoose supplies them.
 */
export interface User {
  email: string;

  passwordHash: string;

  firstName: string;

  lastName: string;

  role?: UserRole;

  status?: UserStatus;

  avatarUrl?: string;

  emailVerified?: boolean;

  resetPasswordToken?: string;

  resetPasswordExpiresAt?: Date;


verificationToken?: string;

verificationTokenExpiresAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}