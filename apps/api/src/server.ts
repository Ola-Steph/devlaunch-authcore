import "dotenv/config";

import app from "./app.js";
import { env } from "./common/config/index.js";
import { connectDatabase } from "./common/database/mongoose.js";
import { logger } from "./common/logger/logger.js";

async function bootstrap() {
  await connectDatabase();

  app.listen(env.PORT, () => {
    logger.info(`AuthCore API running on http://localhost:${env.PORT}`);
  });
}

bootstrap();