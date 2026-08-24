import swaggerJsdoc from "swagger-jsdoc";

import { openApiDocs } from "../../docs/index.js";



export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.1.0",

    info: {
      title: "AuthCore Starter API",

      version: "1.0.0",

      description:
        "Production-ready authentication starter kit built with Node.js, Express, TypeScript and MongoDB.",
    },

    servers: [
      {
        url: "http://localhost:4000/api/v1",
        description: "Local Development",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      ...openApiDocs.components,
    },

    security: [
      {
        bearerAuth: [],
      },
    ],

    tags: openApiDocs.tags,

    paths: openApiDocs.paths,
  },

  apis: [],
});