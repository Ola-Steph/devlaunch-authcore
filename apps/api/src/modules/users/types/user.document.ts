import type { HydratedDocument } from "mongoose";

import type { User } from "./user.types.js";

export type UserDocument = HydratedDocument<User>;