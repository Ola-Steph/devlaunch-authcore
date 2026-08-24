import { authPaths } from "./auth.openapi.js";
import { healthPaths } from "./health.openapi.js";

import { responses } from "./responses.openapi.js";
import { schemas } from "./schemas.openapi.js";
import { tags } from "./tags.openapi.js";

export const openApiDocs = {
  tags,

  paths: {
    ...healthPaths,
    ...authPaths,
  },

  components: {
    schemas,

    responses,
  },
};