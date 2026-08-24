import { Router } from "express";

import { authRoutes } from "../modules/auth/index.js";
import { healthRoutes } from "../modules/health/index.js";

const router = Router();

router.use("/health", healthRoutes);

router.use("/auth", authRoutes);

export default router;