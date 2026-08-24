import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { ApiError } from "../errors/ApiError.js";

export function authorize(...roles: string[]) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      return next(
        new ApiError(401, "Authentication required"),
      );
    }

    if (!req.user.role || !roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "Forbidden"),
      );
    }

    next();
  };
}