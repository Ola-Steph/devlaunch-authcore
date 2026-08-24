import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { httpLogger } from "./common/logger/httpLogger.js";
import apiRouter from "./routes/index.js";
import { notFound } from "./common/errors/notFound.js";
import { errorHandler } from "./common/errors/errorHandler.js";
import { authRoutes } from "./modules/auth/index.js";

import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./common/config/swagger.js";

const app = express();

/**
 * Global Middleware
 */
app.use(httpLogger);
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * API Versioning
 */

app.use("/api/v1", apiRouter);

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);

app.use(notFound);

app.use(errorHandler);

export default app;