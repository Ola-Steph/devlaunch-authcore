import mongoose, { Schema } from "mongoose";

import {
  USER_ROLES,
  USER_STATUS,
} from "../../../common/constants/user.constants.js";

import type { User } from "../types/user.types.js";

const userSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },

    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.PENDING,
    },

    avatarUrl: {
      type: String,
    },

      emailVerified: {
        type: Boolean,
        default: false,
      },

      verificationToken: {
      type: String,
      select: false,
    },

    verificationTokenExpiresAt: {
      type: Date,
      select: false,
    },

    resetPasswordToken: {
      type: String,
      select: false,
    },

    resetPasswordExpiresAt: {
      type: Date,
      select: false,
    },



  },

  
  {
    timestamps: true,

    versionKey: false,

        toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (_doc, ret) => {
            const obj = ret as Record<string, unknown>;

            obj.id = String(obj._id);

            delete obj._id;
            delete obj.passwordHash;

            return obj;
        },
        },
  },


  
);



export const UserModel = mongoose.model<User>(
  "User",
  userSchema,
);

export type UserModelType = typeof UserModel;