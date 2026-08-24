export interface CreateUser {
  email: string;

  passwordHash: string;

  firstName: string;
  lastName: string;

  role?: string;

  status?: string;

  avatarUrl?: string;

  emailVerified?: boolean;
}