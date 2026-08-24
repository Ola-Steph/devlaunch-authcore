import type { HydratedDocument } from "mongoose";

import type { User } from "../modules/users/types/user.types.js";

declare global {
  namespace Express {
    interface Request {
      user?: HydratedDocument<User>;
    }
  }
}

export {};