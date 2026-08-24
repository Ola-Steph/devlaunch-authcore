export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export const USER_STATUS = {
  ACTIVE: "active",
  PENDING: "pending",
  SUSPENDED: "suspended",
} as const;

export type UserRole =
  (typeof USER_ROLES)[keyof typeof USER_ROLES];

export type UserStatus =
  (typeof USER_STATUS)[keyof typeof USER_STATUS];