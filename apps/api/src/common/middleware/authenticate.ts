import type { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/ApiError.js";
import { tokenService } from "../security/token.service.js";
import { UserModel } from "../../modules/users/index.js";

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication required");
    }

    const token = authorization.substring(7);

   const payload = tokenService.verifyAccessToken(token);

    const user = await UserModel.findById(payload.id);

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user;

    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
}