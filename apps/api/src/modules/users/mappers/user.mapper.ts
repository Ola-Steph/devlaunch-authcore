import type { UserDocument } from "../types/user.document.js";

import {
  USER_ROLES,
  USER_STATUS,
} from "../../../common/constants/user.constants.js";

export interface PublicUser {
  id: string;
  email: string;

  firstName: string;
  lastName: string;

  role: string;
  status: string;

  avatarUrl?: string;

  emailVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export function toPublicUser(
  user: UserDocument,
): PublicUser {
  return {
    id: user.id,

    email: user.email,

    firstName: user.firstName,
    lastName: user.lastName,

    role: user.role ?? USER_ROLES.USER,
    status: user.status ?? USER_STATUS.PENDING,

    emailVerified: user.emailVerified ?? false,

    createdAt: user.createdAt,
    updatedAt: user.updatedAt,

    ...(user.avatarUrl
      ? { avatarUrl: user.avatarUrl }
      : {}),
  };
}