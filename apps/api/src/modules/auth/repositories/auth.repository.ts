import { UserModel } from "../../users/index.js";

import type { UserDocument } from "../../users/types/user.document.js";

export const authRepository = {
  async findByEmail(
    email: string,
  ): Promise<UserDocument | null> {
    return UserModel.findOne({
      email: email.toLowerCase(),
    }).select("+passwordHash");
  },

  async create(data: Record<string, unknown>) {
    return UserModel.create(data);
  },

findById(id: string) {
  return UserModel.findById(id);
},

findByIdWithPassword(id: string) {
  return UserModel.findById(id).select("+passwordHash");
},

  updatePassword(
    id: string,
    passwordHash: string,
  ) {
    return UserModel.findByIdAndUpdate(
      id,
      {
        passwordHash,
      },
      {
        new: true,
      },
    );
  },

  /**
   * Password reset
   */
  updateResetPasswordToken(
    id: string,
    token: string,
    expiresAt: Date,
  ) {
    return UserModel.findByIdAndUpdate(id, {
      resetPasswordToken: token,
      resetPasswordExpiresAt: expiresAt,
    });
  },

findByResetPasswordToken(token: string) {
  return UserModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpiresAt: {
      $gt: new Date(),
    },
  }).select(
    "+passwordHash +resetPasswordToken +resetPasswordExpiresAt",
  );
},

  clearResetPasswordToken(id: string) {
    return UserModel.findByIdAndUpdate(id, {
      resetPasswordToken: null,
      resetPasswordExpiresAt: null,
    });
  },

  /**
   * Email verification
   */
  updateVerificationToken(
    id: string,
    token: string,
    expiresAt: Date,
  ) {
    return UserModel.findByIdAndUpdate(
      id,
      {
        verificationToken: token,
        verificationTokenExpiresAt: expiresAt,
      },
    );
  },

findByVerificationToken(
  token: string,
) {
  return UserModel.findOne({
    verificationToken: token,
    verificationTokenExpiresAt: {
      $gt: new Date(),
    },
  });
},

  clearVerificationToken(id: string) {
    return UserModel.findByIdAndUpdate(
      id,
      {
        verificationToken: undefined,
        verificationTokenExpiresAt: undefined,
      },
    );
  },

  verifyEmail(id: string) {
    return UserModel.findByIdAndUpdate(
      id,
      {
        emailVerified: true,
      },
    );
  },

  findByEmailWithoutPassword(
  email: string,
) {
  return UserModel.findOne({
    email: email.toLowerCase(),
  });
},

};