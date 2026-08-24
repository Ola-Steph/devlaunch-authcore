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